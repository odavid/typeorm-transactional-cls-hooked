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

export type Options = {
  connectionName?: string | (() => string | undefined)
  propagation?: Propagation
  isolationLevel?: IsolationLevel
};

export function wrapInTransaction<Func extends (this: any, ...args: any[]) => ReturnType<Func>>(
  fn: Func,
  options?: Options & { name?: string | symbol }
) {
  function wrapped(this: unknown, ...newArgs: unknown[]): ReturnType<Func> {
    const context = getNamespace(NAMESPACE_NAME)
    if (!context) {
      throw new Error(
        'No CLS namespace defined in your app ... please call initializeTransactionalContext() before application start.'
      )
    }
    let tempConnectionName =
      options && options.connectionName ? options.connectionName : 'default'
    if (typeof tempConnectionName !== 'string') {
      tempConnectionName = tempConnectionName() || 'default'
    }
    const connectionName: string = tempConnectionName
    const methodNameStr = String(options?.name)

    const propagation: Propagation =
      options && options.propagation ? options.propagation : Propagation.REQUIRED
    const isolationLevel: IsolationLevel | undefined = options && options.isolationLevel
    const isCurrentTransactionActive = getManager(connectionName)?.queryRunner
      ?.isTransactionActive

    const operationId = String(new Date().getTime())
    const logger = getConnection(connectionName).logger
    const log = (message: string) =>
      logger.log(
        'log',
        `Transactional@${operationId}|${connectionName}|${methodNameStr}|${isolationLevel}|${propagation} - ${message}`
      )

    log(`Before starting: isCurrentTransactionActive = ${isCurrentTransactionActive}`)

    const runOriginal = async () => fn.apply(this, [...newArgs])
    const runWithNewHook = async () => runInNewHookContext(context, runOriginal)

    const runWithNewTransaction = async () => {
      const transactionCallback = async (entityManager: EntityManager) => {
        log(
          `runWithNewTransaction - set entityManager in context: isCurrentTransactionActive: ${entityManager?.queryRunner?.isTransactionActive}`
        )
        setEntityManagerForConnection(connectionName, context, entityManager)
        try {
          const result = await fn.apply(this, [...newArgs])
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
    }) as unknown as ReturnType<Func>;
  }

  return wrapped as Func;
}
