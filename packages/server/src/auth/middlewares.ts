import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError, TOKEN_INVALID, UNAUTHORIZED } from '../common/errors';
import type { User } from './types';

export function createMiddlewares() {
  const cookieName = 'jwt';
  const ADMIN = 'admin';
  const tokenSecret = 'yafb_token';

  function verifyToken(req: Request): User {
    const token = req.cookies[cookieName];

    if (!token) {
      throw new AppError('JWT token not found', TOKEN_INVALID);
    }

    try {
      const payload = jwt.verify(token, tokenSecret);

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

      if (payload.role !== ADMIN) {
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
