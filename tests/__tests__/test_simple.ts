import 'reflect-metadata'

import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository, runInTransaction, runOnTransactionCommit, runOnTransactionRollback, wrapInTransaction } from '../../src'
import { createConnection, getConnection } from 'typeorm'
import delay from 'delay';
import { Post } from '../entity/Post'
import { SimpleService } from '../simple/simple.service'

describe('Simple', () => {
  beforeAll(async () => {
    initializeTransactionalContext()
    patchTypeORMRepositoryWithBaseRepository()
    const conn = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      entities: [Post],
      synchronize: true,
      logging: 'all',
    })
  })

  afterAll(async () => await getConnection().close())

  it('Creates a post using service', async () => {
    const repository = getConnection().getRepository(Post)
    const service = new SimpleService(repository)
    const message = 'simple - A successful post'
    const post = await service.createPost(message)

    await delay(10)

    expect(post.id).toBeGreaterThan(0)
    expect(service.success).toEqual('true')
    const dbPost = await service.getPostByMessage(message)
    // tslint:disable-next-line: no-console
    console.log(`dbPost: ${dbPost}`)
    expect(dbPost).toBeTruthy()
  })

  it('Fails creating a post using service', async () => {
    const repository = getConnection().getRepository(Post)
    const service = new SimpleService(repository)
    const message = 'simple - An unsuccessful post'
    expect(service.createPost(message, true)).rejects.toThrow()

    await delay(10);

    expect(service.success).toEqual('false')
    const dbPost = await service.getPostByMessage(message)
    // tslint:disable-next-line: no-console
    console.log(`dbPost: ${dbPost}`)
    expect(dbPost).toBeFalsy()
  })

  it('Create a post using wrapInTransaction', async () => {
    const repository = getConnection().getRepository(Post)
    const post = new Post();
    const message = 'simple - An successful post using wrapInTransaction'
    post.message = message;
    let commitHookCalled = false;

    const result = await (wrapInTransaction(async () => {
      const createdPost = await repository.save(post);
      runOnTransactionCommit(() => {
        commitHookCalled = true
      });
      return createdPost;
    }))()

    await delay(10);

    expect(post.id).toBeGreaterThan(0)
    expect(commitHookCalled).toBeTruthy();
    expect(repository.findOne({ message })).resolves.toBeTruthy();
  });

  it('Fails creating a post using using wrapInTransaction', async () => {
    const repository = getConnection().getRepository(Post)
    const post = new Post();
    const message = 'simple - An failed post using wrapInTransaction'
    post.message = message;
    let rollbackHookCalled = false;

    expect(
      wrapInTransaction(async () => {
        const createdPost = await repository.save(post);
        runOnTransactionRollback(() => {
          rollbackHookCalled = true
        });
        throw new Error('failing')
      })()
    ).rejects.toThrow();

    await delay(100);

    expect(rollbackHookCalled).toBeTruthy();
    expect(repository.findOne({ message })).resolves.toBeUndefined();
  });

  it('Create a post using runInTransaction', async () => {
    const repository = getConnection().getRepository(Post)
    const post = new Post();
    const message = 'simple - An successful post using runInTransaction'
    post.message = message;
    let commitHookCalled = false;

    const result = await runInTransaction(async () => {
      const createdPost = await repository.save(post);
      runOnTransactionCommit(() => {
        commitHookCalled = true
      });
      return createdPost;
    })

    await delay(10);

    expect(post.id).toBeGreaterThan(0)
    expect(commitHookCalled).toBeTruthy();
    expect(repository.findOne({ message })).resolves.toBeTruthy();
  });

  it('Fails creating a post using using runInTransaction', async () => {
    const repository = getConnection().getRepository(Post)
    const post = new Post();
    const message = 'simple - An failed post using runInTransaction'
    post.message = message;
    let rollbackHookCalled = false;

    expect(
      runInTransaction(async () => {
        const createdPost = await repository.save(post);
        runOnTransactionRollback(() => {
          rollbackHookCalled = true
        });
        throw new Error('failing')
      })
    ).rejects.toThrow();

    await delay(100);

    expect(rollbackHookCalled).toBeTruthy();
    expect(repository.findOne({ message })).resolves.toBeUndefined();
  });
})
