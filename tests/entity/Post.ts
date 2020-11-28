import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  message: string
}
