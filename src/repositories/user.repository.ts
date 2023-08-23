import {EntityRepository, IsNull, Repository} from 'typeorm';
import {User} from '../entities/user.entity';
import {comparePassword} from '../utils/bcrypt';
import _ from 'lodash';
import moment from 'moment';

export type searchParams = {
  username: string;
  startedDateFrom: string;
  startedDateTo: string;
  offset?: number;
  limit?: number;
};

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async verifyCredentials(email: string, password: string) {
    try {
      const foundUser = await this.find({
        where: {email, deletedDate: IsNull()},
      });

      const data: User[] = [];

      // validate password
      for (let i = 0; i < foundUser.length; i++) {
        const passwordMatched = await comparePassword(
          password,
          foundUser[i]!.password,
        );
        if (passwordMatched) {
          data.push(foundUser[i]);
        }
      }

      if (!data || data.length > 1) {
        return null;
      }

      return data[0];
    } catch (e) {
      console.log(e);
    }
  }

  async findById(id: number | string) {
    const foundUser = await this.findOne({
      where: {id, deletedDate: IsNull()},
    });

    return foundUser;
  }

  async findByEmail(email: string) {
    try {
      const foundUser = await this.findOne({
        where: {email, deletedDate: IsNull()},
      });

      if (!foundUser) {
        return null;
      }

      return foundUser;
    } catch (e) {
      console.log(e);
    }
  }

  async search(params: searchParams, isCSV?: boolean) {
    const query = this.createQueryBuilder('user');

    if (!_.isNil(params.username) && params.username != '') {
      query.andWhere('user.name LIKE :name', {name: `%${params.username}%`});
    }

    if (!_.isNil(params.startedDateFrom) && params.startedDateFrom != '') {
      query.andWhere('user.startedDate >= :dateFrom', {
        dateFrom: moment(params.startedDateFrom, 'DD/MM/YYYY').format(
          'YYYY-MM-DD',
        ),
      });
    }

    if (!_.isNil(params.startedDateTo) && params.startedDateTo != '') {
      query.andWhere('user.startedDate <= :dateTo', {
        dateTo: moment(params.startedDateTo, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      });
    }

    query.andWhere('user.deletedDate is null');

    query.leftJoinAndSelect('user.group', 'group');

    if (isCSV) {
      return {data: await query.getMany()};
    }

    const count = await query.getCount();

    if (!_.isNil(params.limit)) {
      query.limit(params.limit);
    }

    if (!_.isNil(params.offset)) {
      query.offset(params.offset);
    }

    return {count, data: await query.getMany()};
  }

  async add(user: User) {
    await this.manager.insert('user', user);
  }

  async edit(user: User) {
    await this.manager.update(User, {id: user.id}, user);
  }

  async deleteUser(id: string) {
    await this.createQueryBuilder('user')
      .update(User)
      .set({deletedDate: new Date()})
      .where('id = :id', {id})
      .execute();
  }
}
