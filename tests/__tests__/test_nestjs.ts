import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from '../../src'
import { Post } from '../entity/Post'
import { AppService } from '../nestjs/app.service'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'

describe('NestJS', () => {
  let app: TestingModule
  let service: AppService
  beforeAll(async () => {
    initializeTransactionalContext()
    patchTypeORMRepositoryWithBaseRepository()
    app = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          entities: [Post],
          synchronize: true,
          logging: 'all',
        }),
        TypeOrmModule.forFeature([Post]),
      ],
      exports: [],
      providers: [AppService],
    }).compile()
    service = app.get<AppService>(AppService)
  })

  afterAll(async () => await app.close())

  it('Creates a post using service', async done => {
    const message = 'NestJS - A successful post'
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
    const message = 'NestJS - An unsuccessful post'
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
