import { AppError } from '../../common/errors';
import type { Infras } from '../../infras';
import type { UserFull, NewUser, EncryptedCredentials, Model } from '../types';

export function createModel(infras: Infras): Model {
  const { db, logger } = infras;
  const userTable = 'users';
  const roleTable = 'roles';
  const userRole = 2;

  const joinedFields = [
    'users.id',
    'users.email',
    'users.hashed_password',
    'users.salt',
    'roles.id as role_id',
    'roles.role as role',
  ]

  async function getUser(id: number): Promise<null | UserFull> {
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
      hashed_password: string;
      salt: string;
      role: string;
    };

    if (user === null) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      hashedPassword: user.hashed_password,
      salt: user.salt,
    };
  }

  async function getUserByEmail(email: string): Promise<null | UserFull> {
    logger.debug('Inside getUserByEmail model', { email });

    const user = (await db.findOne(userTable, {
      select: joinedFields,
      where: {
        [`${userTable}.email`]: email,
      },
      join: {
        table: roleTable,
        first: `${userTable}.role_id`,
        second: `${roleTable}.id`,
      },
    })) as null | {
      id: number;
      email: string;
      hashed_password: string;
      salt: string;
      role: string;
    };

    if (user === null) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      hashedPassword: user.hashed_password,
      salt: user.salt,
    };
  }

  async function createUser(user: NewUser): Promise<number> {
    logger.debug('Inside createUser model', { user });
    return await db.insertOne(userTable, {
      data: {
        email: user.email,
        hashed_password: user.hashedPassword,
        salt: user.salt,
        role_id: userRole,
      },
    });
  }

  async function changeUserPassword(
    userID: number,
    credentials: EncryptedCredentials,
  ): Promise<boolean> {
    logger.debug('Inside changeUserPassword model', { userID, credentials });
    return await db.updateOne(userTable, {
      where: {
        id: userID,
      },
      data: {
        salt: credentials.salt,
        hashed_password: credentials.hashedPassword,
      },
    });
  }

  return {
    getUser,
    getUserByEmail,
    createUser,
    changeUserPassword,
  };
}
