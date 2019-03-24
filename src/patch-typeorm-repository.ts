import { Repository } from 'typeorm'
import { BaseRepository } from './BaseRepository'

export const patchTypeORMRepositoryWithBaseRepository = () => {
  Object.getOwnPropertyNames(BaseRepository.prototype).forEach(pName =>
    Object.defineProperty(Repository.prototype, pName, Object.getOwnPropertyDescriptor(
      BaseRepository.prototype,
      pName
    ) as PropertyDescriptor)
  )
}
