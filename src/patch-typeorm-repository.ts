import { EntityManager, Repository, TreeRepository, MongoRepository } from 'typeorm'
import { getEntityManagerOrTransactionManager } from './common'

export const patchRepositoryManager = (repositoryType: any) => {
  Object.defineProperty(repositoryType, "manager", {
    get(){
      return getEntityManagerOrTransactionManager(this._connectionName, this._manager)
    },
    set(manager: EntityManager | undefined){
      this._manager = manager
      this._connectionName = manager?.connection?.name
    }
  })
}

export const patchTypeORMRepositoryWithBaseRepository = () => {
  patchRepositoryManager(Repository.prototype)
  patchRepositoryManager(MongoRepository.prototype)
}

export const patchTypeORMTreeRepositoryWithBaseTreeRepository = () => {
  patchRepositoryManager(TreeRepository.prototype)
}
