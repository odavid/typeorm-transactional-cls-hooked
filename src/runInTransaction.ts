import { Options, wrapInTransaction } from './wrapInTransaction';

export function runInTransaction<Func extends (this: any) => ReturnType<Func>>(
  fn: Func,
  options?: Options,
) {
  const wrapper = wrapInTransaction(fn, options);
  return wrapper();
}
