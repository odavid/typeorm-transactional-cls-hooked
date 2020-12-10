import { EntityManager, Repository, TreeRepository, MongoRepository } from 'typeorm'
import { getEntityManagerOrTransactionManager } from './common'
import { debugLog } from './DebugLog'

export const patchRepositoryManager = (repositoryType: any) => {
  debugLog(
    `Transactional@patchRepositoryManager repositoryType: ${repositoryType?.constructor?.name}`
  )
  Object.defineProperty(repositoryType, 'manager', {
    get() {
      return getEntityManagerOrTransactionManager(this._connectionName, this._manager)
    },
    set(manager: EntityManager | undefined) {
      this._manager = manager
      this._connectionName = manager?.connection?.name
    },
  })
}

export const patchTypeORMRepositoryWithBaseRepository = () => {
  patchRepositoryManager(Repository.prototype)
  // Since MongoRepository inherits from Repository, but does declare the manager, we re-patch it
  // See #64 and #65
  Object.defineProperty(MongoRepository.prototype, 'manager', {
    configurable: true,
    writable: true,
  })
}

export const patchTypeORMTreeRepositoryWithBaseTreeRepository = () => {
  patchRepositoryManager(TreeRepository.prototype)
}
