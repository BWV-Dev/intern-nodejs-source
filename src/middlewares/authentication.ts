/**
 * Authentication Middlewares
 */
import * as logger from '../utils/logger';
import {UNAUTHORIZED} from 'http-status';
import {NextFunction, Request, Response} from 'express';

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
