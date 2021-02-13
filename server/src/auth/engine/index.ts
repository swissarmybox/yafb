import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppError, DUPLICATE_USER, UNAUTHORIZED } from '../../common/errors';
import { Credentials, Profile, Password } from '../../common/types/auth';
import type { Infras } from '../../infras';
import type { Engine, Model } from '../types';

export function createEngine(infras: Infras, model: Model): Engine {
  const { logger } = infras;

  const tokenSecret = 'yafb_token';
  const expireTime = 3000000;
  const saltRounds = 10; // make it more secure in prod

  async function registerUser(credentials: Credentials): Promise<string> {
    logger.debug('Inside registerUser engine', { credentials });
    const { email, password } = credentials;

    const user = await model.getUserByEmail(email);
    if (user) {
      throw new AppError('User email already exist', DUPLICATE_USER);
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    await model.createUser({
      email,
      hashedPassword,
      salt,
    });

    // TODO: This and model.createUser
    // should be one action
    const newlySavedUser = await model.getUserByEmail(email);
    if (newlySavedUser === null) {
      // TODO: should never happen if
      // this is combined to one
      throw new AppError('NEVER');
    }

    const payload = {
      id: newlySavedUser.id,
      email: newlySavedUser.email,
      role: newlySavedUser.role,
    };

    // TODO: Make async
    const token = jwt.sign(payload, tokenSecret, {
      algorithm: 'HS256',
      expiresIn: expireTime,
    });

    return token;
  }

  async function login(credentials: Credentials): Promise<string> {
    logger.debug('Inside login engine', { credentials });
    const { email, password } = credentials;
    const user = await model.getUserByEmail(email);
    if (!user) {
      throw new AppError('User is not registered', UNAUTHORIZED);
    }

    const passwordIsValid = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordIsValid) {
      throw new AppError('Invalid password', UNAUTHORIZED);
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // TODO: Make async
    const token = jwt.sign(payload, tokenSecret, {
      algorithm: 'HS256',
      expiresIn: expireTime,
    });

    return token;
  }

  async function getProfile(userID: number): Promise<Profile> {
    logger.debug('Inside getProfile engine', { userID });
    const user = await model.getUser(userID);
    if (!user) {
      throw new AppError('User is not registered', UNAUTHORIZED);
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async function changePassword(
    userID: number,
    password: Password,
  ): Promise<void> {
    logger.debug('Inside changePassword engine', { userID, password });
    const { oldPassword, newPassword } = password;

    const user = await model.getUser(userID);
    if (!user) {
      throw new AppError('User is not registered', UNAUTHORIZED);
    }

    const oldPasswordIsValid = await bcrypt.compare(
      oldPassword,
      user.hashedPassword,
    );

    if (!oldPasswordIsValid) {
      throw new AppError('Invalid old password', UNAUTHORIZED);
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const changed = await model.changeUserPassword(userID, {
      hashedPassword,
      salt,
    });

    if (!changed) {
      throw new AppError('Failed to change password');
    }
  }

  return {
    registerUser,
    login,
    getProfile,
    changePassword,
  };
}
