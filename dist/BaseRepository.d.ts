import { ObjectLiteral, Repository } from 'typeorm';
export declare class BaseRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
}
