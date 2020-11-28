import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Post } from '../entity/Post'
import { SimpleService } from '../simple/simple.service'

@Injectable()
export class AppService extends SimpleService {
  constructor(
    @InjectRepository(Post)
    readonly repository: Repository<Post>
  ) {
    super(repository)
  }
}
