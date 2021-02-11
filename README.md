# typeorm-transactional-cls-hooked
[![npm version](http://img.shields.io/npm/v/typeorm-transactional-cls-hooked.svg?style=flat)](https://npmjs.org/package/typeorm-transactional-cls-hooked "View this project on npm")


A `Transactional` Method Decorator for [typeorm](http://typeorm.io/) that uses [cls-hooked](https://www.npmjs.com/package/cls-hooked) to handle and propagate transactions between different repositories and service methods.

Inspired by [Spring Transactional](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html) Annotation and [Sequelize CLS](http://docs.sequelizejs.com/manual/tutorial/transactions.html)

See [Changelog](CHANGELOG.md)

## Installation

```shell
npm install --save typeorm-transactional-cls-hooked
## Needed dependencies
npm install --save typeorm reflect-metadata
```

Or

```shell
yarn add typeorm-transactional-cls-hooked
## Needed dependencies
yarn add typeorm reflect-metadata
```

> **Note**: You will need to import `reflect-metadata` somewhere in the global place of your app - https://github.com/typeorm/typeorm#installation

## Initialization

In order to use it, you will first need to initialize the cls-hooked namespace before your application is started

```typescript
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';

initializeTransactionalContext() // Initialize cls-hooked
...
app = express()
...
```

## BaseRepository

Since this is an external library, all your typeorm repositories will need to be a [custom repository](https://github.com/typeorm/typeorm/blob/master/docs/custom-repository.md) extending either the `BaseRepository` (when using TypeORM's [`Entity`](https://github.com/typeorm/typeorm/blob/master/docs/entities.md)) or the `BaseTreeRepository` class (when using TypeORM's [`TreeEntity`](https://github.com/typeorm/typeorm/blob/master/docs/tree-entities.md)).

```typescript
// Post.entity.ts
@Entity()
export class Post{
  @PrimaryGeneratedColumn()
  id: number

  @Column
  message: string
  ...
}

// Post.repository.ts
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(Post)
export class PostRepository extends BaseRepository<Post> {}
```

The only purpose of the `BaseRepository` class is to make sure the `manager` property of the repository will always be the right one. In cases where inheritance is not possible, you can always [Patch the Repository/TreeRepository](#patching-typeorm-repository) to enable the same functionality as the `BaseRepository`


### Patching TypeORM Repository
Sometimes there is a need to keep using the [TypeORM Repository](https://github.com/typeorm/typeorm/blob/master/src/repository/Repository.ts) instead of using the `BaseRepository`.
For this cases, you will need to *"mixin/patch"* the original `Repository` with the `BaseRepository`.
By doing so, you will be able to use the original `Repository` and not change the code or use `BaseRepository`.
> This method was taken from https://gist.github.com/Diluka/87efbd9169cae96a012a43d1e5695667 (Thanks @Diluka)

In order to do that, the following should be done during initialization:

```typescript
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from 'typeorm-transactional-cls-hooked';

initializeTransactionalContext() // Initialize cls-hooked
patchTypeORMRepositoryWithBaseRepository() // patch Repository with BaseRepository.
```

If there is a need to keep using the TypeORM [`TreeRepository`](https://github.com/typeorm/typeorm/blob/master/docs/tree-entities.md#working-with-tree-entities) instead of using `BaseTreeRepository`, use `patchTypeORMTreeRepositoryWithBaseTreeRepository`.


---
**IMPORTANT NOTE**

Calling [initializeTransactionalContext](#initialization) and [patchTypeORMRepositoryWithBaseRepository](#patching-typeorm-repository) must happen BEFORE any application context is initialized!

---



## Using Transactional Decorator

- Every service method that needs to be transactional, need to use the `@Transactional()` decorator
- The decorator can take a `connectionName` as argument (by default it is `default`)
  - In some cases, where the connectionName should be dynamically evaluated, the value of connectionName can be a function that returns a string.
- The decorator can take an optional `propagation` as argument to define the [propagation behaviour](#transaction-propagation)
- The decorator can take an optional `isolationLevel` as argument to define the [isolation level](#isolation-levels) (by default it will use your database driver's default isolation level.)

```typescript
export class PostService {
  constructor(readonly repository: PostRepository)

  @Transactional() // Will open a transaction if one doesn't already exist
  async createPost(id, message): Promise<Post> {
    const post = this.repository.create({ id, message })
    return this.repository.save(post)
  }
}
```

## Transaction Propagation

The following propagation options can be specified:

- `MANDATORY` - Support a current transaction, throw an exception if none exists.
- `NESTED` - Execute within a nested transaction if a current transaction exists, behave like `REQUIRED` else.
- `NEVER` - Execute non-transactionally, throw an exception if a transaction exists.
- `NOT_SUPPORTED` - Execute non-transactionally, suspend the current transaction if one exists.
- `REQUIRED` (default behaviour) - Support a current transaction, create a new one if none exists.
- `REQUIRES_NEW` - Create a new transaction, and suspend the current transaction if one exists.
- `SUPPORTS` - Support a current transaction, execute non-transactionally if none exists.

## Isolation Levels

The following isolation level options can be specified:

- `READ_UNCOMMITTED` - A constant indicating that dirty reads, non-repeatable reads and phantom reads can occur.
- `READ_COMMITTED` - A constant indicating that dirty reads are prevented; non-repeatable reads and phantom reads can occur.
- `REPEATABLE_READ` - A constant indicating that dirty reads and non-repeatable reads are prevented; phantom reads can occur.
- `SERIALIZABLE` = A constant indicating that dirty reads, non-repeatable reads and phantom reads are prevented.

**NOTE**: If a transaction already exist and a method is decorated with `@Transactional` and `propagation` *does not equal* to `REQUIRES_NEW`, then the declared `isolationLevel` value will *not* be taken into account.

## Hooks

Because you hand over control of the transaction creation to this library, there is no way for you to know whether or not the current transaction was sucessfully persisted to the database.

To circumvent that, we expose three helper methods that allow you to hook into the transaction lifecycle and take appropriate action after a commit/rollback.

- `runOnTransactionCommit(cb)` takes a callback to be executed after the current transaction was sucessfully committed
- `runOnTransactionRollback(cb)` takes a callback to be executed after the current transaction rolls back. The callback gets the error that initiated the roolback as a parameter.
- `runOnTransactionComplete(cb)` takes a callback to be executed at the completion of the current transactional context. If there was an error, it gets passed as an argument.



```typescript
export class PostService {
    constructor(readonly repository: PostRepository, readonly events: EventService) {}

    @Transactional()
    async createPost(id, message): Promise<Post> {
        const post = this.repository.create({ id, message })
        const result = await this.repository.save(post)
        runOnTransactionCommit(() => this.events.emit('post created'))
        return result
    }
}
```

## Unit Test Mocking
`@Transactional` and `BaseRepository` can be mocked to prevent running any of the transactional code in unit tests.

This can be accomplished in Jest with:

```typescript
jest.mock('typeorm-transactional-cls-hooked', () => ({
  Transactional: () => () => ({}),
  BaseRepository: class {},
}));
```

Repositories, services, etc. can be mocked as usual.

## Logging / Debug
The `Transactional` uses the [Typeorm Connection logger](https://github.com/typeorm/typeorm/blob/master/docs/logging.md) to emit [`log` messages](https://github.com/typeorm/typeorm/blob/master/docs/logging.md#logging-options).

In order to enable logs, you should set `logging: ["log"]` or `logging: ["all"]` to your typeorm logging configuration.

The Transactional log message structure looks as follows:

```
Transactional@UNIQ_ID|CONNECTION_NAME|METHOD_NAME|ISOLATION|PROPAGATION - MESSAGE
```
* UNIQ_ID - a timestamp taken at the begining of the Transactional call
* CONNECTION_NAME - The typeorm connection name passed to the Transactional decorator
* METHOD_NAME - The decorated method in action
* ISOLATION - The [Isolation Level](#isolation-levels) passed to the Transactional decorator
* PROPAGATION - The [Propagation](#transaction-propagation) value passed to the Transactional decorator

During [initialization](#initialization) and [patching repositories](#patching-typeorm-repository), the [Typeorm Connection logger](https://github.com/typeorm/typeorm/blob/master/docs/logging.md) is not available yet.
For this reason, the `console.log()` is being used, but only if `TRANSACTIONAL_CONSOLE_DEBUG` environment variable is defined.
