import winston from '../winston';
import {Request} from 'express';
import requestIp from 'request-ip';

/**
 * Write info log
 * @param req
 * @param message
 */
export const logInfo = async (req: Request, message?: string) => {
  winston.info(
    `[${requestIp.getClientIp(req) || ''}][${req.sessionID}][${(req.user
      ? req.user.id
      : '') || ''}][Route: ${req.originalUrl || ''}][${req.method ||
      ''}][${req.protocol || ''}][${message || ''}]`,
  );
};

/**
 * Write error log
 * @param req
 * @param error
 */
export const logError = async (req: Request, error: string) => {
  winston.error(
    `[${requestIp.getClientIp(req) || ''}][${req.sessionID}][${(req.user
      ? req.user.id
      : '') || ''}][Route: ${req.originalUrl || ''}][${req.method ||
      ''}][${req.protocol || ''}][${error}]`,
  );
};

/**
 * Write warning log
 * @param req
 * @param error
 */
export const logWarning = async (req: Request, message: string) => {
  winston.log(
    'warn',
    `[${requestIp.getClientIp(req) || ''}][${req.sessionID}][${(req.user
      ? req.user.id
      : '') || ''}][Route: ${req.originalUrl || ''}][${req.method ||
      ''}][${req.protocol || ''}][${message}]`,
  );
};
