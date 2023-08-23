import {EntityRepository, IsNull, Repository, getConnection} from 'typeorm';
import {Group} from '../entities/group.entity';
import _ from 'lodash';

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
  async findExistedById(id: number | string) {
    const foundGroup = await this.findOne({
      where: {id}
    });

    return foundGroup;
  }

  async findById(id: number | string) {
    const foundGroup = await this.findOne({
      where: {id, deletedDate: IsNull()},
    });

    return foundGroup;
  }

  async findListGroupName() {
    const query = this.createQueryBuilder('group');

    query.select('group.id');

    query.addSelect('group.name');

    query.andWhere('group.deletedDate is null');

    query.orderBy('group.name', 'ASC');

    return query.getMany();
  }

  async findAll(offset?: number, limit?: number) {
    const query = this.createQueryBuilder('group');

    query.leftJoinAndSelect('group.user', 'user');

    query.orderBy('group.id', 'DESC');

    const count = await query.getCount();

    if (!_.isNil(limit)) {
      query.limit(limit);
    }

    if (!_.isNil(offset)) {
      query.offset(offset);
    }

    return {count, data: await query.getMany()};
  }

  async import(data: []) {
    const queryRunner = getConnection().createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save('group', data);

      // Commit transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    }
  }
}
