import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../common/errors';

export interface ErrLoggerFn {
  (text: string, meta: any): void;
}

export type ErrorHandler = ReturnType<typeof createCatchAllError>;

export function createCatchAllError(errLoggerFn: ErrLoggerFn) {
  return function (
    error: AppError,
    req: Request,
    res: Response,
    // eslint-disable-next-line
    next: NextFunction,
  ): void {
    errLoggerFn(error.name, {
      code: error.code,
      name: error.name,
      message: error.message,
      stack: error.stack,
      isOperational: error.isOperational,
    });

    res.status(error.code).send({
      status: 'failure',
      error: {
        name: error.name,
        code: error.code,
        message: error.message,
        isOperational: error.isOperational,
      },
    });
  };
}
