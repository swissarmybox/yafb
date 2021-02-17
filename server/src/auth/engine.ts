import {
  AppError,
  DUPLICATE_USER,
  UNAUTHORIZED,
  FATAL,
} from '../common/errors';
import type { Infras } from '../infras';
import type {
  Credentials,
  Profile,
  Password,
  Engine,
  Model,
  Bcrypt,
  JWT,
} from './types';
import type { Config } from '../configs/server';

export function createEngine(
  infras: Infras,
  model: Model,
  bcrypt: Bcrypt,
  jwt: JWT,
  config: Config,
): Engine {
  const { logger } = infras;
  const { secret, expireIn, saltRounds } = config.auth;

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

    const newlySavedUser = await model.getUserByEmail(email);
    if (newlySavedUser === null) {
      throw new AppError('Newly registered user is deleted', FATAL);
    }

    const payload = {
      id: newlySavedUser.id,
      email: newlySavedUser.email,
      role: newlySavedUser.role,
    };

    const token = jwt.sign(payload, secret, {
      algorithm: 'HS256',
      expiresIn: expireIn,
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

    const token = jwt.sign(payload, secret, {
      algorithm: 'HS256',
      expiresIn: expireIn,
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
