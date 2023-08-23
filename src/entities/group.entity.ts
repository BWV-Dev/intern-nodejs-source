import {Entity, Column, JoinColumn, OneToOne} from 'typeorm';
import {Base} from './base';
import {User} from './user.entity';

/**
 * Model definition
 */
@Entity({
  name: 'group',
  synchronize: false,
})
export class Group extends Base {
  @Column({
    type: 'varchar',
    length: 255,
    name: 'name',
  })
  name: string;

  @Column({
    type: 'text',
    name: 'note',
  })
  note: string;

  @Column({
    type: 'bigint',
    name: 'group_leader_id',
  })
  groupLeaderId: number;

  @Column({
    type: 'int',
    name: 'group_floor_number',
  })
  groupFloorNumber: number;

  @OneToOne(() => User)
  @JoinColumn({name: 'group_leader_id'})
  user: User;
}
