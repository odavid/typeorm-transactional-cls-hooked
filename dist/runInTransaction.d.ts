import { Options } from './wrapInTransaction';
export declare function runInTransaction<Func extends (this: any) => ReturnType<Func>>(fn: Func, options?: Options): ReturnType<Func>;
