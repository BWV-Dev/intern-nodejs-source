// validationMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { flatten } from 'lodash';

export function validationMiddleware<T>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(dtoClass, req.body);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors = await validate(dto as Record<string, any>);

    if (errors.length > 0) {
      const errorMessages = flatten(
        errors.map(error => Object.values(error.constraints || {})),
      );

      if (errors.length > 0) {
        return res.status(400).json({ errors: errorMessages });
      }
    } else {
      req.body = dto;
      next();
    }
  };
}
