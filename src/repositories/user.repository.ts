import {EntityRepository, Repository} from 'typeorm';
import {User} from '../entities/user.entity';
import {comparePassword} from '../utils/bcrypt';
import {getCurrentSystemDatetime} from '../utils/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async verifyCredentials(username: string, password: string) {
    const foundUser = await this.findOne({where: {username, deleted: 0}});

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
  }
}
