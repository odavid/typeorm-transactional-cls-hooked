import { createNamespace, getNamespace, Namespace } from 'cls-hooked'
import { EventEmitter } from 'events'
import { EntityManager, getManager } from 'typeorm'

export const NAMESPACE_NAME = '__typeOrm___cls_hooked_tx_namespace'

const TYPE_ORM_KEY_PREFIX = '__typeOrm__transactionalEntityManager_'
const TYPE_ORM_HOOK_KEY = '__typeOrm__transactionalCommitHooks'

export const initializeTransactionalContext = () =>
  getNamespace(NAMESPACE_NAME) || createNamespace(NAMESPACE_NAME)

export const getEntityManagerOrTransactionManager = (
  connectionName: string,
  entityManager: EntityManager | undefined
): EntityManager => {
  const context = getNamespace(NAMESPACE_NAME)

  if (context && context.active) {
    const transactionalEntityManager = getEntityManagerForConnection(connectionName, context)

    if (transactionalEntityManager) {
      return transactionalEntityManager
    }
  }
  return entityManager || getManager(connectionName)
}

export const getEntityManagerForConnection = (
  connectionName: string,
  context: Namespace
): EntityManager => {
  return context.get(`${TYPE_ORM_KEY_PREFIX}${connectionName}`)
}

export const setEntityManagerForConnection = (
  connectionName: string,
  context: Namespace,
  entityManager: EntityManager | null
) => context.set(`${TYPE_ORM_KEY_PREFIX}${connectionName}`, entityManager)

export const getHookInContext = (context: Namespace): EventEmitter | null => {
  return context.get(TYPE_ORM_HOOK_KEY)
}

export const setHookInContext = (context: Namespace, emitter: EventEmitter | null) => {
  return context.set(TYPE_ORM_HOOK_KEY, emitter)
}
