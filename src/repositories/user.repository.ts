import { AppDataSource } from '../dataSource';
import { User } from '../entities/user.entity';
import { comparePassword } from '../utils/bcrypt';
import { getCurrentSystemDatetime } from '../utils/common';

export const UserRepository = AppDataSource.getRepository(User).extend({
  async verifyCredentials(email: string, password: string) {
    const foundUser = await this.findOne({ where: { email, deleted: 0 } });

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
});
