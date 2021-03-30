import { Options, wrapInTransaction } from './wrapInTransaction'

/**
 * Used to declare a Transaction operation. In order to use it, you must use {@link BaseRepository} custom repository in order to use the Transactional decorator
 * @param connectionName - the typeorm connection name. 'default' by default
 * @param propagation - The transaction propagation type. see {@link Propagation}
 * @param isolationLevel - The transaction isolation level. see {@link IsolationLevel}
 */
export function Transactional(options?: Options): MethodDecorator {
  return (target: any, methodName: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const originalMethod = descriptor.value
    descriptor.value = wrapInTransaction(originalMethod, { ...options, name: methodName })

    Reflect.getMetadataKeys(originalMethod).forEach(previousMetadataKey => {
      const previousMetadata = Reflect.getMetadata(previousMetadataKey, originalMethod)
      Reflect.defineMetadata(previousMetadataKey, previousMetadata, descriptor.value)
    })

    Object.defineProperty(descriptor.value, 'name', { value: originalMethod.name, writable: false })
  }
}
