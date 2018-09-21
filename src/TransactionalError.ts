export class TransactionalError extends Error {
  public name = 'TransactionalError'
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, TransactionalError.prototype)
  }
}
