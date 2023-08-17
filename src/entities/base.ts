import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('tinyint')
  deleted: number;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'created_by',
  })
  createdBy: string;

  @Column({
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'updated_by',
  })
  updatedBy: string;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
