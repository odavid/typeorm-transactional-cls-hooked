import { EntityManager, ObjectLiteral, Repository } from 'typeorm'
import { getEntityManagerOrTransactionManager } from './common'

export class BaseRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
  private _connectionName: string = 'default'
  private _manager: EntityManager | undefined

  set manager(manager: EntityManager) {
    this._manager = manager
    this._connectionName = manager.connection.name
  }

  get manager(): EntityManager {
    return getEntityManagerOrTransactionManager(this._connectionName, this._manager)
  }
}
