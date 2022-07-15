/// <reference types="node" />
import { Namespace } from 'cls-hooked';
import { EventEmitter } from 'events';
import { EntityManager } from 'typeorm';
export declare const NAMESPACE_NAME = "__typeOrm___cls_hooked_tx_namespace";
export declare const initializeTransactionalContext: () => Namespace;
export declare const getEntityManagerOrTransactionManager: (connectionName: string, entityManager: EntityManager | undefined) => EntityManager;
export declare const getEntityManagerForConnection: (connectionName: string, context: Namespace) => EntityManager;
export declare const setEntityManagerForConnection: (connectionName: string, context: Namespace, entityManager: EntityManager | null) => EntityManager | null;
export declare const getHookInContext: (context: Namespace | undefined) => EventEmitter | null;
export declare const setHookInContext: (context: Namespace, emitter: EventEmitter | null) => EventEmitter | null;
