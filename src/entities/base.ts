import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Base {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'date',
    name: 'created_date',
  })
  createdDate: Date;

  @Column({
    type: 'date',
    name: 'updated_date',
  })
  updatedDate: Date;

  @Column({
    type: 'date',
    name: 'deleted_date',
  })
  deletedDate: Date;
}
