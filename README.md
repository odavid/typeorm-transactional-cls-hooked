# typeorm-transactional-cls-hooked

A `Transactional` Method Decorator for [typeorm](http://typeorm.io/) that uses [cls-hooked](https://www.npmjs.com/package/cls-hooked) to handle and propagate transactions between different repositories and service methods.

Inpired by [Spring Transactional](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html) Annotation and [Sequelize CLS](http://docs.sequelizejs.com/manual/tutorial/transactions.html)

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

In order to use it, you will first need to initialize the cls-hooked namesapce before your application is started

```typescript
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';

initializeTransactionalContext() // Initialize cls-hooked
...
app = express()
...
```

## BaseRepository

Since this is an external library, All your typeorm repositories, will need to be a [custom repository](https://github.com/typeorm/typeorm/blob/master/docs/custom-repository.md) extending the `BaseRepsitory` class.

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

Every service method that needs to be transactional, need to use the `Transactional Decorator`
The decorator can take a `connectionName` as argument (by default it is `default`)
The decorator can take a `propagation` as argument defining the [propgatation behavior](#transaction-propagation)

```typescript
export class PostService {
  constructor(readonly repository: PostRepsitory)

  @Transactional() // Will open a transaction if not already exists
  async createPost(id, message): Promise<Post> {
    const post = this.repository.create({ id, message })
    return this.repository.save(post)
  }
}
```

## Transaction Propagation

The following propagation options can be specified (as mentioned before, inspired by Spring Transactional):

- `MANDATORY` - Support a current transaction, throw an exception if none exists.
- `NESTED` - Execute within a nested transaction if a current transaction exists, behave like `REQUIRED` else.
- `NEVER` - Execute non-transactionally, throw an exception if a transaction exists.
- `NOT_SUPPORTED` - Execute non-transactionally, suspend the current transaction if one exists.
- `REQUIRED` (default behavior) - Support a current transaction, create a new one if none exists.
- `REQUIRES_NEW` - Create a new transaction, and suspend the current transaction if one exists.
- `SUPPORTS` - Support a current transaction, execute non-transactionally if none exists.
