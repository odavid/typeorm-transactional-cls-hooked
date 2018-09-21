import { getNamespace } from 'cls-hooked'
import { getManager } from 'typeorm'
import {
  getEntityManagerForConnection,
  NAMESPACE_NAME,
  setEntityManagerForConnection,
} from './common'
import { Propagation } from './Propagation'
import { TransactionalError } from './TransactionalError'

/**
 * Used to declare a Transaction operation. In order to use it, you must use {@link BaseRepository} custom repository in order to use the Transactional decorator
 * @param connectionName - the typeorm connection name. 'default' by default
 * @param propagation - The transaction propagation type. see {@link Propagation}
 */
export function Transactional(
  connectionName: string = 'default',
  propagation: Propagation = Propagation.REQUIRES_NEW
): MethodDecorator {
  return (target: any, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const originalMethod = descriptor.value

    descriptor.value = function(...args: any[]) {
      const context = getNamespace(NAMESPACE_NAME)
      if (!context) {
        throw new Error(
          'No CLS namespace defined in your app ... please call initializeTransactionalContext() before application start.'
        )
      }

      const runOriginal = () => originalMethod.apply(this, [...args])
      const runWithNewTransaction = () =>
        getManager(connectionName).transaction(async entityManager => {
          setEntityManagerForConnection(connectionName, context, entityManager)
          const result = await originalMethod.apply(this, [...args])
          setEntityManagerForConnection(connectionName, context, null)
          return result
        })

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
                "Found an existing transaction found for transaction marked with propagation 'NEVER'"
              )
            }
            return runOriginal()
          case Propagation.NOT_SUPPORTED:
            if (currentTransaction) {
              setEntityManagerForConnection(connectionName, context, null)
              const result = await runOriginal()
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
            runWithNewTransaction()
          case Propagation.SUPPORTS:
            return runOriginal()
        }
        if (currentTransaction) {
          return runOriginal()
        }
        return runWithNewTransaction()
      })
    }
  }
}
