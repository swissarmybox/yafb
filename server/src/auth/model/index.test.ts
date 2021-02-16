import { createModel } from './index'

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

describe('Auth Model', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getUser', () => {
    it('given non existing user id, should return null', async () => {
      // Arrange
      const model = createModel(infras)
      db.findOne.mockImplementationOnce(() => Promise.resolve(null))

      // Act
      const user = await model.getUser(2)

      // Assert
      expect(db.findOne).toHaveBeenCalledTimes(1)
      expect(db.findOne).toHaveBeenCalledWith('users', {
        select: [
          'users.id',
          'users.email',
          'users.hashed_password',
          'users.salt',
          'roles.id as role_id',
          'roles.role as role',
        ],
        where: {
          'users.id': 2
        },
        join: {
          table: 'roles',
          first: 'users.role_id',
          second: 'roles.id',
        },
      })
      expect(user).toEqual(null)
    })

    it('given existing user id, should return user', async () => {
      // Arrange
      const someDate = (new Date()).toISOString()

      const model = createModel(infras)
      db.findOne.mockImplementationOnce(() => Promise.resolve({
        id: 2,
        email: 'users@mail.com',
        role: 'user',
        salt: 'salt',
        hashed_password: 'hashed_password',
      }))

      // Act
      const user = await model.getUser(2)

      // Assert
      expect(db.findOne).toHaveBeenCalledTimes(1)
      expect(db.findOne).toHaveBeenCalledWith('users', {
        select: [
          'users.id',
          'users.email',
          'users.hashed_password',
          'users.salt',
          'roles.id as role_id',
          'roles.role as role',
        ],
        where: {
          'users.id': 2
        },
        join: {
          table: 'roles',
          first: 'users.role_id',
          second: 'roles.id',
        },
      })
      expect(user).toEqual({
        id: 2,
        email: 'users@mail.com',
        role: 'user',
        salt: 'salt',
        hashedPassword: 'hashed_password',
      })
    })
  })

  describe('getUserByEmail', () => {
    it('given non existing user email, should return null', async () => {
      // Arrange
      const model = createModel(infras)
      db.findOne.mockImplementationOnce(() => Promise.resolve(null))

      // Act
      const user = await model.getUserByEmail('hello@mail.com')

      // Assert
      expect(db.findOne).toHaveBeenCalledTimes(1)
      expect(db.findOne).toHaveBeenCalledWith('users', {
        select: [
          'users.id',
          'users.email',
          'users.hashed_password',
          'users.salt',
          'roles.id as role_id',
          'roles.role as role',
        ],
        where: {
          'users.email': 'hello@mail.com'
        },
        join: {
          table: 'roles',
          first: 'users.role_id',
          second: 'roles.id',
        },
      })
      expect(user).toEqual(null)
    })

    it('given existing user email, should return user', async () => {
      // Arrange
      const someDate = (new Date()).toISOString()

      const model = createModel(infras)
      db.findOne.mockImplementationOnce(() => Promise.resolve({
        id: 2,
        email: 'users@mail.com',
        role: 'user',
        salt: 'salt',
        hashed_password: 'hashed_password',
      }))

      // Act
      const user = await model.getUserByEmail('users@mail.com')

      // Assert
      expect(db.findOne).toHaveBeenCalledTimes(1)
      expect(db.findOne).toHaveBeenCalledWith('users', {
        select: [
          'users.id',
          'users.email',
          'users.hashed_password',
          'users.salt',
          'roles.id as role_id',
          'roles.role as role',
        ],
        where: {
          'users.email': 'users@mail.com',
        },
        join: {
          table: 'roles',
          first: 'users.role_id',
          second: 'roles.id',
        },
      })
      expect(user).toEqual({
        id: 2,
        email: 'users@mail.com',
        role: 'user',
        salt: 'salt',
        hashedPassword: 'hashed_password',
      })
    })
  })

  describe('createUser', () => {
    it('given a new user, should create user', async () => {
      // Arrange
      const model = createModel(infras)
      db.insertOne.mockImplementationOnce(() => Promise.resolve(3))

      // Act
      const userID = await model.createUser({
        email: 'user@mail.com',
        hashedPassword: 'hashedPassword',
        salt: 'salt',
      })

      // Assert
      expect(db.insertOne).toHaveBeenCalledTimes(1)
      expect(db.insertOne).toHaveBeenCalledWith('users', {
        data: {
          email: 'user@mail.com',
          hashed_password: 'hashedPassword',
          salt: 'salt',
          role_id: 2,
        }
      })
      expect(userID).toEqual(3)
    })
  })

  describe('changeUserPassword', () => {
    it('given a user id and new credentials, should change user password', async () => {
      // Arrange
      const model = createModel(infras)
      db.updateOne.mockImplementationOnce(() => Promise.resolve(true))

      // Act
      const updated = await model.changeUserPassword(3, {
        hashedPassword: 'hashedPassword',
        salt: 'salt',
      })

      // Assert
      expect(db.updateOne).toHaveBeenCalledTimes(1)
      expect(db.updateOne).toHaveBeenCalledWith('users', {
        where: {
          id: 3,
        },
        data: {
          hashed_password: 'hashedPassword',
          salt: 'salt',
        }
      })
      expect(updated).toEqual(true)
    })
  })
});
