# typeorm-transactional-cls-hooked

A `Transactional` Method Decorator for [typeorm](http://typeorm.io/) that uses [cls-hooked](https://www.npmjs.com/package/cls-hooked) to handle and propagate transactions between different repositories and service methods.

Inspired by [Spring Transactional](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html) Annotation and [Sequelize CLS](http://docs.sequelizejs.com/manual/tutorial/transactions.html)

## Installation

```shell
yarn add typeorm-transactional-cls-hooked
## Needed dependencies
yarn add cls-hooked typeorm
```

Or

```shell
npm install --save typeorm-transactional-cls-hooked
## Needed dependencies
npm install --save cls-hooked typeorm
```

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

Since this is an external library, all your typeorm repositories will need to be a [custom repository](https://github.com/typeorm/typeorm/blob/master/docs/custom-repository.md) extending the `BaseRepository` class.

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

## Using Transactional Decorator

- Every service method that needs to be transactional, need to use the `@Transactional()` decorator
- The decorator can take a `connectionName` as argument (by default it is `default`)
- The decorator can take an optional `propagation` as argument to define the [propagation behaviour](#transaction-propagation)
- The decorator can take an optional `isolationLevel` as argument to define the [isolation level](#isolation-levels) (by default it will use your database driver's default isolation level.)

```typescript
export class PostService {
  constructor(readonly repository: PostRepsitory)

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
