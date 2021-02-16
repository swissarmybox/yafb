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
  getTodos: jest.fn(),
  getTodo: jest.fn(),
  createTodo: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
}

describe('Todo Engine', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getTodos', () => {
    it('should return todos', async () => {
      // Arrange
      const someDate = (new Date()).toISOString()

      const engine = createEngine(infras, model)
      model.getTodos.mockImplementationOnce(() => Promise.resolve([
        {
          id: 1,
          title: 'Hello',
          description: 'World',
          done: false,
          createdAt: someDate,
          updatedAt: someDate,
        },
        {
          id: 2,
          title: 'Hai',
          description: 'Dunia',
          done: false,
          createdAt: someDate,
          updatedAt: someDate,
        },
      ]))

      // Act
      const todos = await engine.getTodos(2)

      // Assert
      expect(model.getTodos).toHaveBeenCalledTimes(1)
      expect(model.getTodos).toHaveBeenCalledWith(2)
      expect(todos).toEqual([
        {
          id: 1,
          title: 'Hello',
          description: 'World',
          done: false,
          createdAt: someDate,
          updatedAt: someDate,
        },
        {
          id: 2,
          title: 'Hai',
          description: 'Dunia',
          done: false,
          createdAt: someDate,
          updatedAt: someDate,
        },
      ])
    })
  })

  describe('getTodo', () => {
    it('given non existing todo id, should throw error', async () => {
      // Arrange
      const engine = createEngine(infras, model)
      model.getTodo.mockImplementationOnce(() => Promise.resolve(null))

      // Act Assert
      try {
        await engine.getTodo(1, 3)
        expect(true).toBe(false)
      } catch (err) {
        expect(err.name).toBe('NOT_FOUND_ERROR')
        expect(err.message).toBe('Failed to find todo with id 3')
        expect(err.isOperational).toBe(true)
      }

      // Assert
      expect(model.getTodo).toHaveBeenCalledTimes(1)
      expect(model.getTodo).toHaveBeenCalledWith(1, 3)
    })

    it('given existing todo id, should return todo', async () => {
      // Arrange
      const someDate = (new Date()).toISOString()

      const engine = createEngine(infras, model)
      model.getTodo.mockImplementationOnce(() => Promise.resolve({
        id: 1,
        title: 'Hello',
        description: 'World',
        done: false,
        createdAt: someDate,
        updatedAt: someDate,
      }))

      // Act
      const todo = await engine.getTodo(1, 3)

      // Assert
      expect(model.getTodo).toHaveBeenCalledTimes(1)
      expect(model.getTodo).toHaveBeenCalledWith(1, 3)
      expect(todo).toEqual({
        id: 1,
        title: 'Hello',
        description: 'World',
        done: false,
        createdAt: someDate,
        updatedAt: someDate,
      })
    })
  })

  describe('createTodo', () => {
    it('given todo and user id, should create todo', async () => {
      // Arrange
      const someDate = (new Date()).toISOString()

      const engine = createEngine(infras, model)
      model.createTodo.mockImplementationOnce(() => Promise.resolve(1))

      // Act
      await engine.createTodo(2, {
        title: 'Hello',
        description: 'World',
      })

      // Assert
      expect(model.createTodo).toHaveBeenCalledTimes(1)
      expect(model.createTodo).toHaveBeenCalledWith(2, {
        title: 'Hello',
        description: 'World',
      })
    })
  });

  describe('updateTodo', () => {
    it('given user id, todo id and todo, should throw error if not updated', async () => {
      // Arrange
      const engine = createEngine(infras, model)
      model.updateTodo.mockImplementationOnce(() => Promise.resolve(false))

      // Act Assert
      try {
        await engine.updateTodo(2, 4, {
          title: 'Hello',
          description: 'World',
          done: true,
        })
        expect(true).toBe(false)
      } catch (err) {
        expect(err.name).toBe('NOT_FOUND_ERROR')
        expect(err.message).toBe('Failed to update todo with id 4')
        expect(err.isOperational).toBe(true)
      }

      // Assert
      expect(model.updateTodo).toHaveBeenCalledTimes(1)
      expect(model.updateTodo).toHaveBeenCalledWith(2, 4, {
        title: 'Hello',
        description: 'World',
        done: true,
      })
    })

    it('given user id, todo id and todo, should update todo', async () => {
      // Arrange
      const engine = createEngine(infras, model)
      model.updateTodo.mockImplementationOnce(() => Promise.resolve(true))

      // Act
      await engine.updateTodo(2, 4, {
        title: 'Hello',
        description: 'World',
        done: true,
      })

      // Assert
      expect(model.updateTodo).toHaveBeenCalledTimes(1)
      expect(model.updateTodo).toHaveBeenCalledWith(2, 4, {
        title: 'Hello',
        description: 'World',
        done: true,
      })
    })
  });

  describe('deleteTodo', () => {
    it('given user id, todo id, should throw error if not deleted', async () => {
      // Arrange
      const engine = createEngine(infras, model)
      model.deleteTodo.mockImplementationOnce(() => Promise.resolve(false))

      // Act Assert
      try {
        await engine.deleteTodo(2, 4)
        expect(true).toBe(false)
      } catch (err) {
        expect(err.name).toBe('NOT_FOUND_ERROR')
        expect(err.message).toBe('Failed to delete todo with id 4')
        expect(err.isOperational).toBe(true)
      }

      // Assert
      expect(model.deleteTodo).toHaveBeenCalledTimes(1)
      expect(model.deleteTodo).toHaveBeenCalledWith(2, 4)
    })

    it('given user id, todo id and todo, should delete todo', async () => {
      // Arrange
      const engine = createEngine(infras, model)
      model.deleteTodo.mockImplementationOnce(() => Promise.resolve(true))

      // Act
      await engine.deleteTodo(2, 4)

      // Assert
      expect(model.deleteTodo).toHaveBeenCalledTimes(1)
      expect(model.deleteTodo).toHaveBeenCalledWith(2, 4)
    })
  });
});
