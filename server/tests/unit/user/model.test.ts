import { infras } from '../_mocks/infras';
import { config } from '../_mocks/config';
import { createModel } from '../../../src/api/user/model';

const { db } = infras;

describe('User Model', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getUsers', () => {
    it('should return users', async () => {
      // Arrange
      const someDate = new Date().toISOString();

      const model = createModel(config, infras);
      db.findAll.mockImplementationOnce(() =>
        Promise.resolve([
          {
            id: 1,
            email: 'admin@mail.com',
            role: 'admin',
            created_at: someDate,
            updated_at: someDate,
          },
          {
            id: 2,
            email: 'user@mail.com',
            role: 'user',
            created_at: someDate,
            updated_at: someDate,
          },
        ]),
      );

      // Act
      const todos = await model.getUsers();

      // Assert
      expect(db.findAll).toHaveBeenCalledTimes(1);
      expect(db.findAll).toHaveBeenCalledWith('users', {
        select: [
          'users.id',
          'users.email',
          'roles.id as role_id',
          'roles.role as role',
        ],
        join: {
          table: 'roles',
          first: 'users.role_id',
          second: 'roles.id',
        },
      });
      expect(todos).toEqual([
        {
          id: 1,
          email: 'admin@mail.com',
          role: 'admin',
          createdAt: someDate,
          updatedAt: someDate,
        },
        {
          id: 2,
          email: 'user@mail.com',
          role: 'user',
          createdAt: someDate,
          updatedAt: someDate,
        },
      ]);
    });
  });

  describe('getUser', () => {
    it('given non existing user id, should return null', async () => {
      // Arrange
      const model = createModel(config, infras);
      db.findOne.mockImplementationOnce(() => Promise.resolve(null));

      // Act
      const todo = await model.getUser(2);

      // Assert
      expect(db.findOne).toHaveBeenCalledTimes(1);
      expect(db.findOne).toHaveBeenCalledWith('users', {
        select: [
          'users.id',
          'users.email',
          'roles.id as role_id',
          'roles.role as role',
        ],
        where: {
          'users.id': 2,
        },
        join: {
          table: 'roles',
          first: 'users.role_id',
          second: 'roles.id',
        },
      });
      expect(todo).toEqual(null);
    });

    it('given existing todo id, should return todo', async () => {
      // Arrange
      const someDate = new Date().toISOString();

      const model = createModel(config, infras);
      db.findOne.mockImplementationOnce(() =>
        Promise.resolve({
          id: 2,
          email: 'users@mail.com',
          role: 'user',
          created_at: someDate,
          updated_at: someDate,
        }),
      );

      // Act
      const user = await model.getUser(2);

      // Assert
      expect(db.findOne).toHaveBeenCalledTimes(1);
      expect(db.findOne).toHaveBeenCalledWith('users', {
        select: [
          'users.id',
          'users.email',
          'roles.id as role_id',
          'roles.role as role',
        ],
        where: {
          'users.id': 2,
        },
        join: {
          table: 'roles',
          first: 'users.role_id',
          second: 'roles.id',
        },
      });
      expect(user).toEqual({
        id: 2,
        email: 'users@mail.com',
        role: 'user',
        createdAt: someDate,
        updatedAt: someDate,
      });
    });
  });

  describe('deleteUser', () => {
    it('given user id, should return boolean', async () => {
      // Arrange
      const model = createModel(config, infras);
      db.deleteOne.mockImplementationOnce(() => Promise.resolve(true));

      // Act
      const deleted = await model.deleteUser(2);

      // Assert
      expect(db.deleteOne).toHaveBeenCalledTimes(1);
      expect(db.deleteOne).toHaveBeenCalledWith('users', {
        where: {
          id: 2,
        },
      });
      expect(deleted).toBe(true);
    });
  });
});
