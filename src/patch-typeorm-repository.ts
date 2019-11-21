import { Repository, TreeRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { BaseTreeRepository } from './BaseTreeRepository'

export const patchTypeORMRepositoryWithBaseRepository = () => {
  Object.getOwnPropertyNames(BaseRepository.prototype).forEach(pName =>
    Object.defineProperty(Repository.prototype, pName, Object.getOwnPropertyDescriptor(
      BaseRepository.prototype,
      pName
    ) as PropertyDescriptor)
  )
}

export const patchTypeORMTreeRepositoryWithBaseTreeRepository = () => {
  Object.getOwnPropertyNames(BaseTreeRepository.prototype).forEach(pName =>
    Object.defineProperty(TreeRepository.prototype, pName, Object.getOwnPropertyDescriptor(
      BaseTreeRepository.prototype,
      pName
    ) as PropertyDescriptor)
  )
}
