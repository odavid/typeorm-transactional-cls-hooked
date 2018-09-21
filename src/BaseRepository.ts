import { getNamespace } from 'cls-hooked'
import { EntityManager, getManager, ObjectLiteral, Repository } from 'typeorm'
import { getEntityManagerForConnection, NAMESPACE_NAME } from './common'

export class BaseRepository<Entity extends ObjectLiteral> extends Repository<
  Entity
> {
  private _connectionName: string = 'default'
  private _manager: EntityManager | undefined

  set manager(manager: EntityManager) {
    this._manager = manager
    this._connectionName = manager.connection.name
  }

  get manager(): EntityManager {
    return this.getManagerOrTransactionManager()
  }

  private getManagerOrTransactionManager(): EntityManager {
    const context = getNamespace(NAMESPACE_NAME)

    if (context && context.active) {
      const transactionalEntityManager = getEntityManagerForConnection(
        this._connectionName,
        context
      )

      if (transactionalEntityManager) {
        return transactionalEntityManager
      }
    }
    return this._manager || getManager(this._connectionName)
  }
}
