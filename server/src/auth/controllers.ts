import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import type { Infras } from '../infras';
import type { Config } from '../configs/server';
import { createModel } from './model';
import { createEngine } from './engine';
import * as schema from './schema';

export function createControllers(config: Config, infras: Infras) {
  const { logger } = infras;

  const model = createModel(config, infras);
  const engine = createEngine(config, infras, model, bcrypt, jwt);

  const { cookie, httpOnly, secure, expireIn } = config.auth;

  async function registerUser(req: Request, res: Response): Promise<void> {
    const data = await schema.credentials.validateAsync(req.body);
    logger.debug('Inside registerUser controller', { data });

    const token = await engine.registerUser(data);
    res.cookie(cookie, token, {
      httpOnly,
      secure,
      maxAge: expireIn,
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
    res.cookie(cookie, token, {
      httpOnly,
      secure,
      maxAge: expireIn,
    });

    res.json({
      status: 'success',
      data: null,
    });
  }

  async function logout(req: Request, res: Response): Promise<void> {
    logger.debug('Inside logout controller');
    res.clearCookie(cookie);
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

    res.clearCookie(cookie);
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
