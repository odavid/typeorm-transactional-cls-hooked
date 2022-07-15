/// <reference types="node" />
import { Namespace } from 'cls-hooked';
import { EventEmitter } from 'events';
export declare const getTransactionalContextHook: () => EventEmitter;
export declare const createEmitterInNewContext: (context: Namespace) => EventEmitter;
export declare const runAndTriggerHooks: (hook: EventEmitter, cb: () => any) => Promise<any>;
export declare const runInNewHookContext: (context: Namespace, cb: () => any) => Promise<any>;
export declare const runOnTransactionCommit: (cb: () => void) => void;
export declare const runOnTransactionRollback: (cb: (e: Error) => void) => void;
export declare const runOnTransactionComplete: (cb: (e: Error | undefined) => void) => void;
