import { AppError, NOT_FOUND } from '../../../common/errors';
import type { Infras } from '../../../infras';
import type { Todo, NewTodo, UpdateTodo, Model, Engine } from '../types';

export function createEngine(infras: Infras, model: Model): Engine {
  const { logger } = infras;

  async function getTodos(userID: number): Promise<Todo[]> {
    logger.debug('Inside getTodos engine', { userID });
    return await model.getTodos(userID);
  }

  async function getTodo(userID: number, todoID: number): Promise<Todo> {
    logger.debug('Inside getTodo engine', { userID, todoID });

    const todo = await model.getTodo(userID, todoID);
    if (todo === null) {
      throw new AppError(`Failed to find todo with id ${todoID}`, NOT_FOUND);
    }

    return todo;
  }

  async function createTodo(userID: number, todo: NewTodo): Promise<number> {
    logger.debug('Inside createTodo engine', { userID, todo });
    return await model.createTodo(userID, todo);
  }

  async function updateTodo(
    userID: number,
    todoID: number,
    todo: UpdateTodo,
  ): Promise<void> {
    logger.debug('Inside updateTodo engine', { userID, todoID, todo });
    const updated = await model.updateTodo(userID, todoID, todo);

    if (!updated) {
      throw new AppError(`Failed to update todo with id ${todoID}`, NOT_FOUND);
    }
  }

  async function deleteTodo(userID: number, todoID: number): Promise<void> {
    logger.debug('Inside deleteTodo engine', { userID, todoID });
    const deleted = await model.deleteTodo(userID, todoID);

    if (!deleted) {
      throw new AppError(`Failed to delete todo with id ${todoID}`, NOT_FOUND);
    }
  }

  return {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
  };
}
