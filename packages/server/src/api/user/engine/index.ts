import { AppError, NOT_FOUND } from '../../../common/errors';
import type { Infras } from '../../../infras';
import type { User, Engine, Model } from '../types';

export function createEngine(infras: Infras, model: Model): Engine {
  const { logger } = infras;

  async function getUsers(): Promise<User[]> {
    logger.debug('Inside getUsers engine');
    return await model.getUsers();
  }

  async function getUser(id: number): Promise<User> {
    logger.debug('Inside getUser engine', { id });

    const user = await model.getUser(id);
    if (user === null) {
      throw new AppError(`Failed to find user with id ${id}`, NOT_FOUND);
    }

    return user;
  }

  async function deleteUser(id: number): Promise<void> {
    logger.debug('Inside deleteUser engine', { id });
    const deleted = await model.deleteUser(id);

    if (!deleted) {
      throw new AppError(`Failed to delete user with id ${id}`, NOT_FOUND);
    }
  }

  return {
    getUsers,
    getUser,
    deleteUser,
  };
}
