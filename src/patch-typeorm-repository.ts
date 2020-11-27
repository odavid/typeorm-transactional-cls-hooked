import { EntityManager, Repository, TreeRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { BaseTreeRepository } from './BaseTreeRepository'

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
}

export const patchTypeORMTreeRepositoryWithBaseTreeRepository = () => {
  patchRepositoryManager(TreeRepository.prototype)
}
