import { createNamespace, getNamespace, Namespace } from 'cls-hooked'
import { EntityManager } from 'typeorm'

export const NAMESPACE_NAME = '__typeOrm___cls_hooked_tx_namespace'

const TYPE_ORM_KEY_PREFIX = '__typeOrm__transactionalEntityManager_'

export const initializeTransactionalContext = () =>
  getNamespace(NAMESPACE_NAME) || createNamespace(NAMESPACE_NAME)

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
