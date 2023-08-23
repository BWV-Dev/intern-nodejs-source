import {Request, Response, NextFunction} from 'express';
import * as logger from '../utils/logger';
import {UserRepository} from '../repositories/user.repository';
import {getCustomRepository} from 'typeorm';

/**
 * List of roles to be able to access to the screen
 * @param roles
 */
export const permission = (roles: number[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = getCustomRepository(UserRepository);
    const userLogin = await userRepository.findById(req.user.id!);

    if (userLogin) {
      req.user.name = userLogin.name;
      req.user.email = userLogin.email;
      req.user.groupId = userLogin.groupId;
      req.user.positionId = userLogin.positionId;

      if (!roles.includes(req.user.positionId || 0)) {
        logger.logWarning(req, `権限エラー`);
        res.redirect('/logout');
        return;
      }
    } else {
      res.redirect('/login');
    }
    next();
  };
};
