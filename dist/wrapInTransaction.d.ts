import { DataSource } from 'typeorm';
import { IsolationLevel } from './IsolationLevel';
import { Propagation } from './Propagation';
export declare type Options = {
    connectionName?: string | (() => string | undefined);
    propagation?: Propagation;
    isolationLevel?: IsolationLevel;
    dataSource?: DataSource;
};
export declare function wrapInTransaction<Func extends (this: any, ...args: any[]) => ReturnType<Func>>(fn: Func, options?: Options & {
    name?: string | symbol;
}): Func;
