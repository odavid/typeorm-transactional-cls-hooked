import 'reflect-metadata'

import {initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository, Transactional, runOnTransactionCommit, runOnTransactionRollback} from '../../src'
import { createConnection, getConnection, Repository } from 'typeorm';
import {Post} from '../entity/Post'

class PostService{
  constructor(readonly repository: Repository<Post>, public success: string = ""){}

  @Transactional()
  async createPost(message: string, fail: boolean = false): Promise<Post>{
    const post = new Post()
    post.message = message
    await this.repository.save(post)
    runOnTransactionCommit(() => this.success = "true")
    runOnTransactionRollback(() => this.success = "false");
    if(fail){
      throw Error("fail = true, so failing")
    }
    return post
  }

  async getPostByMessage(message: string){
    return this.repository.findOne({message: message})
  }
}

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
    logging: "all",
  })
})

afterAll(async () => await getConnection().close())

afterEach(async () => await getConnection().getRepository(Post).query(`delete from post`))

it('Creates a post using service', async (done) => {
  const repository = await getConnection().getRepository(Post)
  const service = new PostService(repository)
  const message = "A successful post"
  const post = await service.createPost(message)
  expect(post.id).toBeGreaterThan(0)
  setTimeout(async () => {
    expect(service.success).toEqual("true")
    const dbPost = await service.getPostByMessage(message)
    console.log(`dbPost: ${dbPost}`)
    expect(dbPost).toBeTruthy()
    done()
  }, 1000)
})

it('Fails creating a post using service', async (done) => {
  const repository = await getConnection().getRepository(Post)
  const service = new PostService(repository)
  const message = "An unsuccessful post"
  try{
    const post = await service.createPost(message, true)
  }catch(e){
    setTimeout(async () => {
      expect(service.success).toEqual("false")
      const dbPost = await service.getPostByMessage(message)
      console.log(`dbPost: ${dbPost}`)
      expect(dbPost).toBeFalsy()
      done()
    }, 1000)
  }
})
