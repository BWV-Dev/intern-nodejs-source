import { AppDataSource } from '../dataSource';
import { User } from '../entities/user.entity';
import { comparePassword } from '../utils/bcrypt';
import { getCurrentSystemDatetime } from '../utils/common';

export const UserRepository = AppDataSource.getRepository(User).extend({
  async verifyCredentials(email: string, password: string) {
    const foundUser = await this.findOne({where: {email, deleted: 0}});

    if (!foundUser) {
      return null;
    }

    // validate password
    const passwordMatched = await comparePassword(
      password,
      foundUser!.password,
    );

    if (!passwordMatched) {
      return null;
    }

    // update last_login
    foundUser.lastLogin = getCurrentSystemDatetime();
    foundUser.updatedBy = foundUser.name;

    await this.update(foundUser.id, foundUser);

    return foundUser;
  },

  async searchUsers(
    name: string,
    role: number[] | undefined,
    enteredDateFrom: string | undefined,
    enteredDateTo: string | undefined,
    length: any,
    start: any,
  ) {
    try {
      let userList;

      const queryBuilder = this.createQueryBuilder('user')
        .select([
          'user.id AS id',
          'user.name AS name',
          'user.email AS email',
          'user.role AS role',
          'user.created_at as createdAt',
        ])
        .orderBy('user.name', 'ASC')
        .where('user.deleted = 0');

      if (name) {
        queryBuilder.andWhere('user.name like :name', {
          name: `%${name}%`,
        });
      }
      if (role) {
        queryBuilder.andWhere('user.role IN (:role)', {
          role,
        });
      }

      if (enteredDateFrom) {
        queryBuilder.andWhere('Date(user.created_at) >= :enteredDateFrom', {
          enteredDateFrom: `${enteredDateFrom}`,
        });
      }
      if (enteredDateTo) {
        queryBuilder.andWhere('Date(user.created_at) <= :enteredDateTo', {
          enteredDateTo,
        });
      }

      const recordsFiltered = await queryBuilder.getCount();

      if (length) {
        queryBuilder.limit(length);
      }
      if (start) {
        queryBuilder.offset(start);
      }

      userList = await queryBuilder.getRawMany();

      return {recordsFiltered, userList};
    } catch (error) {
      return error.message;
    }
  },
});
