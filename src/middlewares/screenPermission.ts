import {Request, Response, NextFunction} from 'express';
import {titleMessageError, messages} from '../constants';
import * as logger from '../utils/logger';

/**
 * List of roles to be able to access to the screen
 * @param roles
 */
export const permission = (roles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role || 0)) {
      logger.logWarning(req, `権限エラー`);

      res.render('errors/index', {
        title: titleMessageError.FORBIDDEN,
        content: messages.FORBIDDEN,
      });

      return;
    }
    next();
  };
};
