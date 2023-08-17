/**
 * Authentication Middlewares
 */
import * as logger from '../utils/logger';
import { UNAUTHORIZED } from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';

/**
 * If the user is not authorized, then redirect to login page
 */
export default async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user.isAuthorized) {
    res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
  } else {
    try {
      if (!req.xhr) {
        // Audit log every action
        logger.logInfo(req);
      }

      // get new User info
      if (!req.url.startsWith('/asset')) {
        req.session.user = await UserRepository.getUserInfo(req.user.id!);
      }

      next();
    } catch (err) {
      if (err.response && err.response.status === UNAUTHORIZED) {
        logger.logWarning(req, err);
        res.redirect(`/logout?redirect=${encodeURIComponent(req.originalUrl)}`);
        return;
      } else {
        next();
      }
    }
  }
};
