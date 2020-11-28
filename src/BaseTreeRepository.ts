import { ObjectLiteral, TreeRepository } from 'typeorm'
import { patchRepositoryManager } from './patch-typeorm-repository'

export class BaseTreeRepository<Entity extends ObjectLiteral> extends TreeRepository<Entity> {}

patchRepositoryManager(BaseTreeRepository.prototype)
