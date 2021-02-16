import { createEngine } from './index'

const logger = {
  debug: jest.fn(),
  http: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

const db = {
  disconnect: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
  deleteAll: jest.fn(),
  resetTable: jest.fn(),
}

const infras = {
  logger,
  db,
}

const model = {
  getUsers: jest.fn(),
  getUser: jest.fn(),
  deleteUser: jest.fn(),
}

describe('User Engine', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getUsers', () => {
    it('should return users', async () => {
      // Arrange
      const someDate = (new Date()).toISOString()

      const engine = createEngine(infras, model)
      model.getUsers.mockImplementationOnce(() => Promise.resolve([
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
      ]))

      // Act
      const users = await engine.getUsers()

      // Assert
      expect(model.getUsers).toHaveBeenCalledTimes(1)
      expect(users).toEqual([
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
      ])
    })
  })

  describe('getUser', () => {
    it('given non existing user id, should throw error', async () => {
      // Arrange
      const engine = createEngine(infras, model)
      model.getUser.mockImplementationOnce(() => Promise.resolve(null))

      // Act Assert
      try {
        await engine.getUser(3)
        expect(true).toBe(false)
      } catch (err) {
        expect(err.name).toBe('NOT_FOUND_ERROR')
        expect(err.message).toBe('Failed to find user with id 3')
        expect(err.isOperational).toBe(true)
      }

      // Assert
      expect(model.getUser).toHaveBeenCalledTimes(1)
      expect(model.getUser).toHaveBeenCalledWith(3)
    })

    it('given existing user id, should return user', async () => {
      // Arrange
      const someDate = (new Date()).toISOString()

      const engine = createEngine(infras, model)
      model.getUser.mockImplementationOnce(() => Promise.resolve({
        id: 1,
        email: 'admin@mail.com',
        role: 'admin',
        createdAt: someDate,
        updatedAt: someDate,
      }))

      // Act
      const user = await engine.getUser(3)

      // Assert
      expect(model.getUser).toHaveBeenCalledTimes(1)
      expect(model.getUser).toHaveBeenCalledWith(3)
      expect(user).toEqual({
        id: 1,
        email: 'admin@mail.com',
        role: 'admin',
        createdAt: someDate,
        updatedAt: someDate,
      })
    })
  })

  describe('deleteTodo', () => {
    it('given user id, should throw error if not deleted', async () => {
      // Arrange
      const engine = createEngine(infras, model)
      model.deleteUser.mockImplementationOnce(() => Promise.resolve(false))

      // Act Assert
      try {
        await engine.deleteUser(4)
        expect(true).toBe(false)
      } catch (err) {
        expect(err.name).toBe('NOT_FOUND_ERROR')
        expect(err.message).toBe('Failed to delete user with id 4')
        expect(err.isOperational).toBe(true)
      }

      // Assert
      expect(model.deleteUser).toHaveBeenCalledTimes(1)
      expect(model.deleteUser).toHaveBeenCalledWith(4)
    })

    it('given user id, should delete user', async () => {
      // Arrange
      const engine = createEngine(infras, model)
      model.deleteUser.mockImplementationOnce(() => Promise.resolve(true))

      // Act
      await engine.deleteUser(4)

      // Assert
      expect(model.deleteUser).toHaveBeenCalledTimes(1)
      expect(model.deleteUser).toHaveBeenCalledWith(4)
    })
  });
});
