import type { Request, Response } from 'express';
import type { Infras } from '../../infras';
import { createModel } from './model';
import { createEngine } from './engine';
import * as schema from './schema';

export function createControllers(infras: Infras) {
  const { logger } = infras;
  const model = createModel(infras);
  const engine = createEngine(infras, model);

  async function getUsers(req: Request, res: Response): Promise<void> {
    logger.debug('Inside getUsers controller');

    const users = await engine.getUsers();
    res.json({
      status: 'success',
      data: users,
    });
  }

  async function getUser(req: Request, res: Response): Promise<void> {
    const userID = await schema.userID.validateAsync(req.params.id);
    logger.debug('Inside getUser controller', { userID });

    const user = await engine.getUser(userID);
    res.json({
      status: 'success',
      data: user,
    });
  }

  async function deleteUser(req: Request, res: Response): Promise<void> {
    const userID = await schema.userID.validateAsync(req.params.id);
    logger.debug('Inside deleteUser controller', { userID });

    await engine.deleteUser(userID);
    res.json({
      status: 'success',
      data: null,
    });
  }

  return {
    getUsers,
    getUser,
    deleteUser,
  };
}
