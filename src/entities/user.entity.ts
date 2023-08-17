import {Entity, Column} from 'typeorm';
import {Base} from './base';

export enum UserRole {
  ADMIN = 1,
  // SALES = 2,
  // STAFF = 3
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
    length: 255,
    name: 'username',
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'name',
  })
  name: string;

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
    name: 'last_login',
  })
  lastLogin?: string;
}
