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
      const todosSample = [
        {
          id: 1,
          title: 'Hello',
          description: 'World',
          done: false,
          createdAt: (new Date()).toISOString(),
          updatedAt: (new Date()).toISOString(),
        },
        {
          id: 2,
          title: 'Hai',
          description: 'Dunia',
          done: false,
          createdAt: (new Date()).toISOString(),
          updatedAt: (new Date()).toISOString(),
        },
      ]

      const engine = createEngine(infras, model)
      model.getTodos.mockImplementationOnce(() => Promise.resolve(todosSample))

      // Act
      const todos = await engine.getTodos(2)

      // Assert
      expect(model.getTodos).toHaveBeenCalledTimes(1)
      expect(model.getTodos).toHaveBeenCalledWith(2)
      expect(todos).toEqual(todosSample)
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
      const todoSample = {
        id: 1,
        title: 'Hello',
        description: 'World',
        done: false,
        createdAt: (new Date()).toISOString(),
        updatedAt: (new Date()).toISOString(),
      }

      const engine = createEngine(infras, model)
      model.getTodo.mockImplementationOnce(() => Promise.resolve(todoSample))

      // Act
      const todo = await engine.getTodo(1, 3)

      // Assert
      expect(model.getTodo).toHaveBeenCalledTimes(1)
      expect(model.getTodo).toHaveBeenCalledWith(1, 3)
      expect(todo).toEqual(todoSample)
    })
  })
});
