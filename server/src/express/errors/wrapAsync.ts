import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError, INVALID_PARAMETER } from '../../common/errors';

export interface Handler {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}

export function wrapAsync(fn: Handler): RequestHandler {
  return function (req, res, next): void {
    fn(req, res, next).catch((err) => {
      if (err.name === 'ValidationError') {
        next(wrapValidationErr(err.message));
        return;
      }

      next(err);
    });
  };
}

function wrapValidationErr(errMsg: string): AppError {
  return new AppError(errMsg, {
    name: INVALID_PARAMETER.name,
    code: INVALID_PARAMETER.code,
    isOperational: INVALID_PARAMETER.isOperational,
  });
}
