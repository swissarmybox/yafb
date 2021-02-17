import { infras } from '../_mocks/infras';
import { config } from '../_mocks/config';
import { createModel } from '../../../src/api/todo/model';

const { db } = infras;

describe('Todo Model', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getTodos', () => {
    it('should return todos', async () => {
      // Arrange
      const someDate = new Date().toISOString();

      const model = createModel(config, infras);
      db.findAll.mockImplementationOnce(() =>
        Promise.resolve([
          {
            id: 1,
            title: 'Hello',
            description: 'World',
            done: false,
            created_at: someDate,
            updated_at: someDate,
          },
          {
            id: 2,
            title: 'Hai',
            description: 'Dunia',
            done: false,
            created_at: someDate,
            updated_at: someDate,
          },
        ]),
      );

      // Act
      const todos = await model.getTodos(2);

      // Assert
      expect(db.findAll).toHaveBeenCalledTimes(1);
      expect(db.findAll).toHaveBeenCalledWith('todos', {
        where: {
          user_id: 2,
        },
      });
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
      ]);
    });
  });

  describe('getTodo', () => {
    it('given non existing todo id, should return null', async () => {
      // Arrange
      const model = createModel(config, infras);
      db.findOne.mockImplementationOnce(() => Promise.resolve(null));

      // Act
      const todo = await model.getTodo(1, 3);

      // Assert
      expect(db.findOne).toHaveBeenCalledTimes(1);
      expect(db.findOne).toHaveBeenCalledWith('todos', {
        where: {
          user_id: 1,
          id: 3,
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
          id: 1,
          title: 'Hello',
          description: 'World',
          done: false,
          created_at: someDate,
          updated_at: someDate,
        }),
      );

      // Act
      const todo = await model.getTodo(1, 3);

      // Assert
      expect(db.findOne).toHaveBeenCalledTimes(1);
      expect(db.findOne).toHaveBeenCalledWith('todos', {
        where: {
          user_id: 1,
          id: 3,
        },
      });
      expect(todo).toEqual({
        id: 1,
        title: 'Hello',
        description: 'World',
        done: false,
        createdAt: someDate,
        updatedAt: someDate,
      });
    });
  });

  describe('createTodo', () => {
    it('given todo and user id, should create todo', async () => {
      // Arrange
      const model = createModel(config, infras);
      db.insertOne.mockImplementationOnce(() => Promise.resolve(1));

      // Act
      await model.createTodo(2, {
        title: 'Hello',
        description: 'World',
      });

      // Assert
      expect(db.insertOne).toHaveBeenCalledTimes(1);
      expect(db.insertOne).toHaveBeenCalledWith('todos', {
        data: {
          title: 'Hello',
          description: 'World',
          user_id: 2,
        },
      });
    });
  });

  describe('updateTodo', () => {
    it('given user id, todo id and todo, should return boolean', async () => {
      // Arrange
      const model = createModel(config, infras);
      db.updateOne.mockImplementationOnce(() => Promise.resolve(false));

      // Act
      await model.updateTodo(2, 4, {
        title: 'Hello',
        description: 'World',
        done: true,
      });

      // Assert
      expect(db.updateOne).toHaveBeenCalledTimes(1);
      expect(db.updateOne).toHaveBeenCalledWith('todos', {
        where: {
          id: 4,
          user_id: 2,
        },
        data: {
          title: 'Hello',
          description: 'World',
          done: true,
        },
      });
    });
  });

  describe('deleteTodo', () => {
    it('given user id and todo id, should return boolean', async () => {
      // Arrange
      const model = createModel(config, infras);
      db.deleteOne.mockImplementationOnce(() => Promise.resolve(false));

      // Act
      await model.deleteTodo(2, 4);

      // Assert
      expect(db.deleteOne).toHaveBeenCalledTimes(1);
      expect(db.deleteOne).toHaveBeenCalledWith('todos', {
        where: {
          id: 4,
          user_id: 2,
        },
      });
    });
  });
});
