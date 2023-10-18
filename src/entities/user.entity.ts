import { Column, Entity } from 'typeorm';
import { Status } from '../constants';
import { Base } from './base';
export enum UserRole {
  ADMIN = 0,
  MANAGER = 1,
  USER = 2
}
/**
 * Model definition
 */
@Entity({
  name: 'user',
  synchronize: false,
  orderBy: {
    id: 'DESC',
  },
})
export class User extends Base {
  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;
  @Column({
    type: 'varchar',
    length: 50,
  })
  email: string;
  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;
  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;
  @Column({
    type: 'enum',
    enum: Status,
  })
  deleted: Status;
  @Column({
    name: 'last_login',
  })
  lastLogin?: string;
}
