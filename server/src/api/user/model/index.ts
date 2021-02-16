import { AppError } from '../../../common/errors';
import type { Infras } from '../../../infras';
import type { User, Model } from '../types';

export function createModel(infras: Infras): Model {
  const { db, logger } = infras;
  const userTable = 'users';
  const roleTable = 'roles';

  const joinedFields = [
    'users.id',
    'users.email',
    'users.hashed_password',
    'users.salt',
    'roles.id as role_id',
    'roles.role as role',
  ]

  async function getUsers(): Promise<User[]> {
    logger.debug('Inside getUsers model');
    const users = (await db.findAll(userTable, {
      select: joinedFields,
      join: {
        table: roleTable,
        first: `${userTable}.role_id`,
        second: `${roleTable}.id`,
      },
    })) as {
      id: number;
      email: string;
      role: string;
      created_at: string;
      updated_at: string;
    }[];

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      createdAt: u.created_at,
      updatedAt: u.updated_at,
    }));
  }

  async function getUser(id: number): Promise<null | User> {
    logger.debug('Inside getUser model', { id });
    const user = (await db.findOne(userTable, {
      select: joinedFields,
      where: {
        [`${userTable}.id`]: id,
      },
      join: {
        table: roleTable,
        first: `${userTable}.role_id`,
        second: `${roleTable}.id`,
      },
    })) as null | {
      id: number;
      email: string;
      role: string;
      created_at: string;
      updated_at: string;
    };

    if (user === null) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  async function deleteUser(id: number): Promise<boolean> {
    logger.debug('Inside deleteUser model', { id });
    return await db.deleteOne(userTable, {
      where: { id },
    });
  }

  return {
    getUsers,
    getUser,
    deleteUser,
  };
}
