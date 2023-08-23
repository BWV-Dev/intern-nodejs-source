import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import {map} from 'lodash';

export default async (req: Request, res: Response, next: NextFunction) => {
  const validatorResult = validationResult(req);
  if (!validatorResult.isEmpty()) {
    const errors = map(validatorResult.array(), mappedError => {
      return mappedError.msg;
    });
    (req.session as any).message = errors;
  }
  next();
};
