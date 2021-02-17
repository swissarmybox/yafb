import { infras } from '../_mocks/infras';
import { config } from '../_mocks/config';
import { createEngine } from '../../../src/auth/engine';

const model = {
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
  getUser: jest.fn(),
  changeUserPassword: jest.fn(),
};

const bcrypt = {
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
};

const jwt = {
  sign: jest.fn(),
};

describe('Auth Engine', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('registerUsers', () => {
    it('given existing credentials, should throw error', async () => {
      // Arrange
      const engine = createEngine(config, infras, model, bcrypt, jwt);
      model.getUserByEmail.mockImplementationOnce(() =>
        Promise.resolve({
          id: 1,
          email: 'user@mail.com',
          role: 'user',
          hashedPassword: 'hashedPassword',
          salt: 'salt',
        }),
      );

      // Act Assert
      try {
        await engine.registerUser({
          email: 'user@mail.com',
          password: 'hola',
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err.name).toBe('DUPLICATE_USER_ERROR');
        expect(err.message).toBe('User email already exist');
        expect(err.isOperational).toBe(true);
      }
    });

    it('given new credentials, should register user', async () => {
      // Arrange
      const engine = createEngine(config, infras, model, bcrypt, jwt);
      model.getUserByEmail.mockImplementationOnce(() => Promise.resolve(null));
      bcrypt.genSalt.mockImplementationOnce(() => Promise.resolve('salt'));
      bcrypt.hash.mockImplementationOnce(() => Promise.resolve('hashed'));

      model.getUserByEmail.mockImplementationOnce(() =>
        Promise.resolve({
          id: 1,
          email: 'user@mail.com',
          role: 'user',
          hashedPassword: 'hashedPassword',
          salt: 'salt',
        }),
      );

      jwt.sign.mockImplementationOnce(() => Promise.resolve('token'));

      // Act
      const token = await engine.registerUser({
        email: 'user@mail.com',
        password: 'hola',
      });

      // Assert
      expect(model.getUserByEmail).toHaveBeenNthCalledWith(1, 'user@mail.com');

      expect(bcrypt.genSalt).toHaveBeenCalledTimes(1);
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);

      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith('hola', 'salt');

      expect(model.createUser).toHaveBeenCalledTimes(1);
      expect(model.createUser).toHaveBeenCalledWith({
        email: 'user@mail.com',
        hashedPassword: 'hashed',
        salt: 'salt',
      });

      expect(model.getUserByEmail).toHaveBeenNthCalledWith(2, 'user@mail.com');

      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: 1,
          email: 'user@mail.com',
          role: 'user',
        },
        'yafb_token',
        {
          algorithm: 'HS256',
          expiresIn: 3000000,
        },
      );

      expect(token.length > 0).toBe(true);
    });
  });

  describe('login', () => {
    it('given non existing credentials, should throw error', async () => {
      // Arrange
      const engine = createEngine(config, infras, model, bcrypt, jwt);
      model.getUserByEmail.mockImplementationOnce(() => Promise.resolve(null));

      // Act Assert
      try {
        await engine.login({
          email: 'user@mail.com',
          password: 'hola',
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err.name).toBe('UNAUTHORIZED_ERROR');
        expect(err.message).toBe('User is not registered');
        expect(err.isOperational).toBe(true);
      }
    });

    it('given invalid password, should throw error', async () => {
      // Arrange
      const engine = createEngine(config, infras, model, bcrypt, jwt);

      model.getUserByEmail.mockImplementationOnce(() =>
        Promise.resolve({
          id: 1,
          email: 'user@mail.com',
          role: 'user',
        }),
      );

      bcrypt.compare.mockImplementationOnce(() => Promise.resolve(false));

      // Act Assert
      try {
        await engine.login({
          email: 'user@mail.com',
          password: 'hola',
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err.name).toBe('UNAUTHORIZED_ERROR');
        expect(err.message).toBe('Invalid password');
        expect(err.isOperational).toBe(true);
      }
    });

    it('given correct credentials, should login', async () => {
      // Arrange
      const engine = createEngine(config, infras, model, bcrypt, jwt);

      model.getUserByEmail.mockImplementationOnce(() =>
        Promise.resolve({
          id: 1,
          email: 'user@mail.com',
          role: 'user',
          hashedPassword: 'hashed',
        }),
      );

      bcrypt.compare.mockImplementationOnce(() => Promise.resolve(true));
      jwt.sign.mockImplementationOnce(() => Promise.resolve('some-token'));

      // Act
      const token = await engine.login({
        email: 'user@mail.com',
        password: 'hola',
      });

      // Assert
      expect(model.getUserByEmail).toHaveBeenCalledTimes(1);
      expect(model.getUserByEmail).toHaveBeenCalledWith('user@mail.com');

      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledWith('hola', 'hashed');

      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: 1,
          email: 'user@mail.com',
          role: 'user',
        },
        'yafb_token',
        {
          algorithm: 'HS256',
          expiresIn: 3000000,
        },
      );

      expect(token).toBe('some-token');
    });
  });

  describe('getProfile', () => {
    it('given non existing user id, should throw error', async () => {
      // Arrange
      const engine = createEngine(config, infras, model, bcrypt, jwt);
      model.getUser.mockImplementationOnce(() => Promise.resolve(null));

      // Act Assert
      try {
        await engine.getProfile(1);
        expect(true).toBe(false);
      } catch (err) {
        expect(err.name).toBe('UNAUTHORIZED_ERROR');
        expect(err.message).toBe('User is not registered');
        expect(err.isOperational).toBe(true);
      }
    });

    it('given existing user id, should return user profile', async () => {
      // Arrange
      const engine = createEngine(config, infras, model, bcrypt, jwt);
      model.getUser.mockImplementationOnce(() =>
        Promise.resolve({
          id: 1,
          email: 'user@mail.com',
          role: 'user',
        }),
      );

      // Act
      const profile = await engine.getProfile(1);

      // Assert
      expect(profile).toEqual({
        id: 1,
        email: 'user@mail.com',
        role: 'user',
      });
    });
  });

  describe('changePassword', () => {
    it('given non existing user id, should throw error', async () => {
      // Arrange
      const engine = createEngine(config, infras, model, bcrypt, jwt);
      model.getUser.mockImplementationOnce(() => Promise.resolve(null));

      // Act Assert
      try {
        await engine.changePassword(1, {
          oldPassword: 'hello',
          newPassword: 'hello',
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err.name).toBe('UNAUTHORIZED_ERROR');
        expect(err.message).toBe('User is not registered');
        expect(err.isOperational).toBe(true);
      }
    });

    it('given invalid password, should throw error', async () => {
      // Arrange
      const engine = createEngine(config, infras, model, bcrypt, jwt);

      model.getUser.mockImplementationOnce(() =>
        Promise.resolve({
          id: 1,
          email: 'user@mail.com',
          role: 'user',
          hashedPassword: 'hashed',
          salt: 'salt',
        }),
      );

      bcrypt.compare.mockImplementationOnce(() => Promise.resolve(false));

      // Act Assert
      try {
        await engine.changePassword(1, {
          oldPassword: 'hello',
          newPassword: 'hello',
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err.name).toBe('UNAUTHORIZED_ERROR');
        expect(err.message).toBe('Invalid old password');
        expect(err.isOperational).toBe(true);
      }
    });

    it('given correct credentials, should throw error if failed to change password', async () => {
      // Arrange
      const engine = createEngine(config, infras, model, bcrypt, jwt);

      model.getUser.mockImplementationOnce(() =>
        Promise.resolve({
          id: 3,
          email: 'user@mail.com',
          role: 'user',
          hashedPassword: 'hashed',
          salt: 'salt',
        }),
      );

      bcrypt.compare.mockImplementationOnce(() => Promise.resolve(true));
      bcrypt.genSalt.mockImplementationOnce(() => Promise.resolve('saltnew'));
      bcrypt.hash.mockImplementationOnce(() => Promise.resolve('hashednew'));

      model.changeUserPassword.mockImplementationOnce(() =>
        Promise.resolve(false),
      );

      // Act Assert
      try {
        await engine.changePassword(3, {
          oldPassword: 'hello',
          newPassword: 'hellonew',
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err.name).toBe('INTERNAL_SERVER_ERROR');
        expect(err.message).toBe('Failed to change password');
        expect(err.isOperational).toBe(false);
      }
    });

    it('given correct credentials, should change password', async () => {
      // Arrange
      const engine = createEngine(config, infras, model, bcrypt, jwt);

      model.getUser.mockImplementationOnce(() =>
        Promise.resolve({
          id: 3,
          email: 'user@mail.com',
          role: 'user',
          hashedPassword: 'hashed',
          salt: 'salt',
        }),
      );

      bcrypt.compare.mockImplementationOnce(() => Promise.resolve(true));
      bcrypt.genSalt.mockImplementationOnce(() => Promise.resolve('saltnew'));
      bcrypt.hash.mockImplementationOnce(() => Promise.resolve('hashednew'));

      model.changeUserPassword.mockImplementationOnce(() =>
        Promise.resolve(true),
      );

      // Act
      await engine.changePassword(3, {
        oldPassword: 'hello',
        newPassword: 'hellonew',
      });

      // Assert
      expect(model.getUser).toHaveBeenCalledTimes(1);
      expect(model.getUser).toHaveBeenCalledWith(3);

      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledWith('hello', 'hashed');

      expect(bcrypt.genSalt).toHaveBeenCalledTimes(1);
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);

      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith('hellonew', 'saltnew');

      expect(model.changeUserPassword).toHaveBeenCalledTimes(1);
      expect(model.changeUserPassword).toHaveBeenCalledWith(3, {
        hashedPassword: 'hashednew',
        salt: 'saltnew',
      });
    });
  });
});
