// @ts-nocheck
/**
 * Error Handler Middleware
 */
// import * as createDebug from 'debug';
import {Request, Response, NextFunction} from 'express';
import {
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} from 'http-status';
import {titleMessageError, messages} from '../constants';
import * as logger from '../utils/logger';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const commonErrorProcess = (err: any, req: Request, res: Response) => {
  let status = BAD_REQUEST;
  if (err.response !== undefined) {
    status = err.response.status;
  }

  if (status === UNAUTHORIZED) {
    logger.logWarning(req, err);
    res.redirect(`/logout?redirect=${encodeURIComponent(req.originalUrl)}`);
    return;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err && (!err.code || err.code !== 'ERR_HTTP_HEADERS_SENT')) {
    logger.logError(req, err);
  }

  let title = titleMessageError.INTERNAL_SERVER_ERROR;
  let error = messages.INTERNAL_SERVER_ERROR;
  let status = BAD_REQUEST;
  if (err.response !== undefined) {
    status = err.response.status;

    if (status === NOT_FOUND) {
      res.render('errors/index', {
        title: titleMessageError.NOT_FOUND,
        content: messages.NOT_FOUND,
      });
      return;
    }

    if (status === INTERNAL_SERVER_ERROR) {
      res.render('errors/index', {
        title: titleMessageError.INTERNAL_SERVER_ERROR,
        content: messages.INTERNAL_SERVER_ERROR,
      });
      return;
    }

    if (status === FORBIDDEN) {
      res.render('errors/index', {
        title: titleMessageError.FORBIDDEN,
        content: messages.FORBIDDEN,
      });
      return;
    }

    if (status === UNAUTHORIZED) {
      res.redirect(`/logout?redirect=${encodeURIComponent(req.originalUrl)}`);
      return;
    }
    status = err.response.status;
    error += `data: ${JSON.stringify(err.response.data)}`;
    title = messages.BAD_REQUEST;
  }

  const userSession = req.session === undefined ? undefined : req.session.user;

  res.status(status).render('errors/index', {
    title,
    content: error,
    layout:
      userSession === undefined
        ? 'layout/noLoginLayout'
        : 'layout/defaultLayout',
  });

  next();
};
