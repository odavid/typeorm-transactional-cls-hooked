import 'reflect-metadata'

import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from '../../src'
import { createConnection, getConnection } from 'typeorm'
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

  it('Creates a post using service', async done => {
    const repository = await getConnection().getRepository(Post)
    const service = new SimpleService(repository)
    const message = 'simple - A successful post'
    const post = await service.createPost(message)
    expect(post.id).toBeGreaterThan(0)
    setTimeout(async () => {
      expect(service.success).toEqual('true')
      const dbPost = await service.getPostByMessage(message)
      console.log(`dbPost: ${dbPost}`)
      expect(dbPost).toBeTruthy()
      done()
    }, 1000)
  })

  it('Fails creating a post using service', async done => {
    const repository = await getConnection().getRepository(Post)
    const service = new SimpleService(repository)
    const message = 'simple - An unsuccessful post'
    try {
      const post = await service.createPost(message, true)
    } catch (e) {
      setTimeout(async () => {
        expect(service.success).toEqual('false')
        const dbPost = await service.getPostByMessage(message)
        console.log(`dbPost: ${dbPost}`)
        expect(dbPost).toBeFalsy()
        done()
      }, 1000)
    }
  })
})
