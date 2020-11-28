import { ObjectLiteral, Repository } from 'typeorm'
import { patchRepositoryManager } from './patch-typeorm-repository'

export class BaseRepository<Entity extends ObjectLiteral> extends Repository<Entity> {}

patchRepositoryManager(BaseRepository.prototype)
