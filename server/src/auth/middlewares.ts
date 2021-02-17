import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError, TOKEN_INVALID, UNAUTHORIZED } from '../common/errors';
import type { User } from './types';
import type { Config } from '../configs/server';

export function createMiddlewares(config: Config) {
  const { auth, roles } = config
  const { cookie, secret } = auth
  const adminRole = roles.admin.name

  function verifyToken(req: Request): User {
    const token = req.cookies[cookie];

    if (!token) {
      throw new AppError('JWT token not found', TOKEN_INVALID);
    }

    try {
      const payload = jwt.verify(token, secret);

      return payload as User;
    } catch (e) {
      throw new AppError('JWT cannot be verified', TOKEN_INVALID);
    }
  }

  async function isLoggedIn(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const payload = verifyToken(req);
      (req as any).user = payload;
      next();
    } catch (err) {
      next(err);
    }
  }

  async function isAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const payload = verifyToken(req);

      if (payload.role !== adminRole) {
        throw new AppError('User is not authorized', UNAUTHORIZED);
      }

      (req as any).user = payload;
      next();
    } catch (err) {
      next(err);
    }
  }

  return {
    isLoggedIn,
    isAdmin,
  };
}
