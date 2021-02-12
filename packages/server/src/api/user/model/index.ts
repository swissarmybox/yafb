import { AppError } from '../../../common/errors';
import type { Infras } from '../../../infras';
import type { User, Model } from '../types';

export function createModel(infras: Infras): Model {
  const { db, logger } = infras;
  const table = 'users';
  const roleTable = 'roles';

  async function getUsers(): Promise<User[]> {
    logger.debug('Inside getUsers model');
    const users = (await db.findAll(table)) as {
      id: number;
      email: string;
      role_id: number;
      created_at: string;
      updated_at: string;
    }[];

    // TODO, how to do Join instead
    const todos = (await db.findAll(roleTable)) as {
      id: number;
      role: string;
    }[];

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      role: (todos.find((t) => t.id === u.role_id) as any).role, // DO JOIN INSTEAD
      createdAt: u.created_at,
      updatedAt: u.updated_at,
    }));
  }

  async function getUser(id: number): Promise<null | User> {
    logger.debug('Inside getUser model', { id });
    const user = (await db.findOne(table, {
      where: { id },
    })) as {
      id: number;
      email: string;
      role_id: number;
      created_at: string;
      updated_at: string;
    };

    if (user === null) {
      return null;
    }

    // TODO: How to do join instead
    const role = (await db.findOne(roleTable, {
      where: {
        id: user.role_id,
      },
    })) as {
      role: string;
    };

    // TODO: This should never happen
    // with join
    if (role === null) {
      throw new AppError('NEVER');
    }

    return {
      id: user.id,
      email: user.email,
      role: role.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  async function deleteUser(id: number): Promise<boolean> {
    logger.debug('Inside deleteUser model', { id });
    return await db.deleteOne(table, {
      where: { id },
    });
  }

  return {
    getUsers,
    getUser,
    deleteUser,
  };
}
