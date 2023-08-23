import {Entity, Column, OneToOne, JoinColumn} from 'typeorm';
import {Base} from './base';
import {Group} from './group.entity';

export enum UserPosition {
  DIRECTOR = 0,
  GROUPLEADER = 1,
  LEADER = 2,
  MEMBER = 3,
}

/**
 * Model definition
 */
@Entity({
  name: 'user',
  synchronize: false,
  orderBy: {
    name: 'ASC',
    startedDate: 'ASC',
    id: 'ASC',
  },
})
export class User extends Base {
  @Column({
    type: 'varchar',
    length: 255,
    name: 'email',
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'name',
  })
  name: string;

  @Column({
    type: 'bigint',
    name: 'group_id',
  })
  groupId: number;

  @Column({
    type: 'date',
    name: 'started_date',
  })
  startedDate: Date;

  @Column({
    type: 'enum',
    enum: UserPosition,
    name: 'position_id',
  })
  positionId: UserPosition;

  @OneToOne(() => Group)
  @JoinColumn({name: 'group_id'})
  group: Group;
}
