import { getNamespace } from 'cls-hooked'
import { EntityManager, getManager } from 'typeorm'
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
  connectionName?: string
  propagation?: Propagation
  isolationLevel?: IsolationLevel
}): MethodDecorator {
  const connectionName: string = options && options.connectionName ? options.connectionName : 'default'
  const propagation: Propagation = options && options.propagation ? options.propagation : Propagation.REQUIRED
  const isolationLevel: IsolationLevel | undefined = options && options.isolationLevel

  return (target: any, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      const context = getNamespace(NAMESPACE_NAME)
      if (!context) {
        throw new Error(
          'No CLS namespace defined in your app ... please call initializeTransactionalContext() before application start.'
        )
      }

      const runOriginal = async () => originalMethod.apply(this, [...args])
      const runWithNewHook = async () => runInNewHookContext(context, runOriginal)

      const runWithNewTransaction = async () => {
        const transactionCallback = async (entityManager: EntityManager) => {
          setEntityManagerForConnection(connectionName, context, entityManager)
          const result = await originalMethod.apply(this, [...args])
          setEntityManagerForConnection(connectionName, context, null)
          return result
        }

        if (isolationLevel) {
          return await runInNewHookContext(context, () => getManager(connectionName).transaction(isolationLevel, transactionCallback))
        } else {
          return await runInNewHookContext(context, () => getManager(connectionName).transaction(transactionCallback))
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
        if (currentTransaction) {
          return runOriginal()
        }
        return runWithNewTransaction()
      })
    }

    Reflect.getMetadataKeys(originalMethod).forEach((previousMetadataKey) => {
      const previousMetadata = Reflect.getMetadata(previousMetadataKey, originalMethod);
      Reflect.defineMetadata(previousMetadataKey, previousMetadata, descriptor.value);
    });
    
    Object.defineProperty(descriptor.value, 'name', {value: originalMethod.name, writable: false});
  }
}
