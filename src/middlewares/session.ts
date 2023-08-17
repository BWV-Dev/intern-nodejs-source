// @ts-nocheck
/**
 * セッションミドルウェア
 */

import {NextFunction, Request, Response} from 'express';
import {IMessage} from '../constants';

export default async (req: Request, _: Response, next: NextFunction) => {
  req.consumeSession = () => {
    let formData;
    if ((req.session as Express.Session).formData !== undefined) {
      formData = {...(req.session as Express.Session).formData};
    }
    let message: IMessage | undefined;
    if ((req.session as Express.Session).message !== undefined) {
      message = {...(req.session as Express.Session).message};
    }
    (req.session as Express.Session).formData = undefined;
    (req.session as Express.Session).message = undefined;
    return {formData, message};
  };
  next();
};
