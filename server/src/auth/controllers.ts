import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import type { Infras } from '../infras';
import { createModel } from './model';
import { createEngine } from './engine';
import * as schema from './schema';

export function createControllers(infras: Infras) {
  const { logger } = infras;
  const model = createModel(infras);
  const engine = createEngine(infras, model, bcrypt, jwt);

  const cookieName = 'jwt';

  async function registerUser(req: Request, res: Response): Promise<void> {
    const data = await schema.credentials.validateAsync(req.body);
    logger.debug('Inside registerUser controller', { data });

    const token = await engine.registerUser(data);
    res.cookie(cookieName, token, {
      httpOnly: true,
      // secure: true,
      // maxAge: expireTime
    });

    res.json({
      status: 'success',
      data: null,
    });
  }

  async function login(req: Request, res: Response): Promise<void> {
    const data = await schema.credentials.validateAsync(req.body);
    logger.debug('Inside login controller', { data });

    const token = await engine.login(data);
    res.cookie(cookieName, token, {
      httpOnly: true,
      // secure: true,
      // maxAge: expireTime
    });

    res.json({
      status: 'success',
      data: null,
    });
  }

  async function logout(req: Request, res: Response): Promise<void> {
    logger.debug('Inside logout controller');
    res.clearCookie(cookieName);
    res.json({
      status: 'success',
      data: null,
    });
  }

  async function getProfile(req: Request, res: Response): Promise<void> {
    const userID = (req as any).user.id;
    logger.debug('Inside getProfile controller', { userID });
    const profile = await engine.getProfile(userID);
    res.json({
      status: 'success',
      data: profile,
    });
  }

  async function changePassword(req: Request, res: Response): Promise<void> {
    const userID = (req as any).user.id;
    const data = await schema.changePassword.validateAsync(req.body);
    logger.debug('Inside changePassword controller', { userID, data });

    await engine.changePassword(userID, data);

    res.clearCookie(cookieName);
    res.json({
      status: 'success',
      data: null,
    });
  }

  return {
    getProfile,
    registerUser,
    login,
    logout,
    changePassword,
  };
}
