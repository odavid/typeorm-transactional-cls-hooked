import { Transactional, runOnTransactionCommit, runOnTransactionRollback } from '../../src'
import { Post } from '../entity/Post'
import { Repository } from 'typeorm'

export class SimpleService {
  constructor(readonly repository: Repository<Post>) {}
  private _success = ''
  get success(): string {
    return this._success
  }
  set success(value: string) {
    this._success = value
  }

  @Transactional()
  async createPost(message: string, fail: boolean = false): Promise<Post> {
    const post = new Post()
    post.message = message
    await this.repository.save(post)
    runOnTransactionCommit(() => (this.success = 'true'))
    runOnTransactionRollback(() => (this.success = 'false'))
    if (fail) {
      throw Error('fail = true, so failing')
    }
    return post
  }

  async getPostByMessage(message: string): Promise<Post | undefined> {
    return this.repository.findOne({ message })
  }
}
