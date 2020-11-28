import { getNamespace } from 'cls-hooked'
import { EntityManager, getConnection, getManager } from 'typeorm'
import {
  getEntityManagerForConnection,
  NAMESPACE_NAME,
  setEntityManagerForConnection,
} from './common'
import { runInNewHookContext } from './hook'
import { IsolationLevel } from './IsolationLevel'
import { Propagation } from './Propagation'
import { TransactionalError } from './TransactionalError'

/**
 * Used to declare a Transaction operation. In order to use it, you must use {@link BaseRepository} custom repository in order to use the Transactional decorator
 * @param connectionName - the typeorm connection name. 'default' by default
 * @param propagation - The transaction propagation type. see {@link Propagation}
 * @param isolationLevel - The transaction isolation level. see {@link IsolationLevel}
 */
export function Transactional(options?: {
  connectionName?: string | (() => string | undefined)
  propagation?: Propagation
  isolationLevel?: IsolationLevel
}): MethodDecorator {

  return (target: any, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const originalMethod = descriptor.value
    descriptor.value = function(...args: any[]) {
      const context = getNamespace(NAMESPACE_NAME)
      if (!context) {
        throw new Error(
          'No CLS namespace defined in your app ... please call initializeTransactionalContext() before application start.'
        )
      }
      let tempConnectionName = options && options.connectionName ? options.connectionName : 'default'
      if (typeof tempConnectionName !== 'string') {
        tempConnectionName = tempConnectionName() || 'default'
      }
      const connectionName: string = tempConnectionName
      const methodNameStr = String(methodName)

      const propagation: Propagation =
        options && options.propagation ? options.propagation : Propagation.REQUIRED
      const isolationLevel: IsolationLevel | undefined = options && options.isolationLevel
      const isCurrentTransactionActive = getManager(connectionName)?.queryRunner?.isTransactionActive

      const operationId = String(new Date().getTime())
      const logger = getConnection(connectionName).logger
      const log = (message: string) => logger.log("log", `Transactional@${operationId}|${connectionName}|${methodNameStr}|${isolationLevel}|${propagation} - ${message}`)

      log(`Before starting: isCurrentTransactionActive = ${isCurrentTransactionActive}`)

      const runOriginal = async () => originalMethod.apply(this, [...args])
      const runWithNewHook = async () => runInNewHookContext(context, runOriginal)

      const runWithNewTransaction = async () => {
        const transactionCallback = async (entityManager: EntityManager) => {
          const isCurrentTransactionActive = entityManager?.queryRunner?.isTransactionActive
          log(`runWithNewTransaction - set entityManager in context: isCurrentTransactionActive: ${isCurrentTransactionActive}`)
          setEntityManagerForConnection(connectionName, context, entityManager)
          try {
            const result = await originalMethod.apply(this, [...args])
            log(`runWithNewTransaction - Success`)
            return result
          } catch (e) {
            log(`runWithNewTransaction - ERROR|${e}`)
            throw e
          } finally {
            log(`runWithNewTransaction - reset entityManager in context`)
            setEntityManagerForConnection(connectionName, context, null)
          }
        }

        if (isolationLevel) {
          return await runInNewHookContext(context, () =>
            getManager(connectionName).transaction(isolationLevel, transactionCallback)
          )
        } else {
          return await runInNewHookContext(context, () =>
            getManager(connectionName).transaction(transactionCallback)
          )
        }
      }

      return context.runAndReturn(async () => {
        const currentTransaction = getEntityManagerForConnection(connectionName, context)

        switch (propagation) {
          case Propagation.MANDATORY:
            if (!currentTransaction) {
              throw new TransactionalError(
                "No existing transaction found for transaction marked with propagation 'MANDATORY'"
              )
            }
            return runOriginal()
          case Propagation.NESTED:
            return runWithNewTransaction()
          case Propagation.NEVER:
            if (currentTransaction) {
              throw new TransactionalError(
                "Found an existing transaction, transaction marked with propagation 'NEVER'"
              )
            }
            return runWithNewHook()
          case Propagation.NOT_SUPPORTED:
            if (currentTransaction) {
              setEntityManagerForConnection(connectionName, context, null)
              const result = await runWithNewHook()
              setEntityManagerForConnection(connectionName, context, currentTransaction)
              return result
            }
            return runOriginal()
          case Propagation.REQUIRED:
            if (currentTransaction) {
              return runOriginal()
            }
            return runWithNewTransaction()
          case Propagation.REQUIRES_NEW:
            return runWithNewTransaction()
          case Propagation.SUPPORTS:
            if (currentTransaction) {
              return runOriginal()
            } else {
              return runWithNewHook()
            }
        }
      })
    }

    Reflect.getMetadataKeys(originalMethod).forEach(previousMetadataKey => {
      const previousMetadata = Reflect.getMetadata(previousMetadataKey, originalMethod)
      Reflect.defineMetadata(previousMetadataKey, previousMetadata, descriptor.value)
    })

    Object.defineProperty(descriptor.value, 'name', { value: originalMethod.name, writable: false })
  }
}
