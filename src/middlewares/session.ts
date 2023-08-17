/**
 * セッションミドルウェア
 */

import { NextFunction, Request, Response } from 'express';
import { IMessage } from '../constants';

export default async (req: Request, _: Response, next: NextFunction) => {
  req.consumeSession = () => {
    let formData;
    if (req.session.formData !== undefined) {
      formData = { ...req.session.formData };
    }
    let message: IMessage | undefined;
    if (req.session.message !== undefined) {
      message = { ...req.session.message };
    }
    req.session.formData = undefined;
    req.session.message = undefined;
    return { formData, message };
  };
  next();
};
