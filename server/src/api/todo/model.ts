import type { Infras } from '../../infras';
import type { Config } from '../../configs/server';
import type { Todo, NewTodo, UpdateTodo, Model } from './types';

export function createModel(config: Config, infras: Infras): Model {
  const { db, logger } = infras;
  const table = config.tables.todo;

  async function getTodos(userID: number): Promise<Todo[]> {
    logger.debug('Inside getTodos model', { userID });
    const todos = (await db.findAll(table, {
      where: {
        user_id: userID,
      },
    })) as {
      id: number;
      title: string;
      description: string;
      done: boolean;
      created_at: string;
      updated_at: string;
    }[];

    return todos.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      done: t.done,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }));
  }

  async function getTodo(userID: number, todoID: number): Promise<null | Todo> {
    logger.debug('Inside getTodo model', { userID, todoID });
    const todo = (await db.findOne(table, {
      where: {
        id: todoID,
        user_id: userID,
      },
    })) as null | {
      id: number;
      title: string;
      description: string;
      done: boolean;
      created_at: string;
      updated_at: string;
    };

    if (todo === null) {
      return null;
    }

    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      done: todo.done,
      createdAt: todo.created_at,
      updatedAt: todo.updated_at,
    };
  }

  async function createTodo(userID: number, todo: NewTodo): Promise<number> {
    logger.debug('Inside createTodo model', { userID, todo });
    return await db.insertOne(table, {
      data: {
        title: todo.title,
        description: todo.description,
        user_id: userID,
      },
    });
  }

  async function updateTodo(
    userID: number,
    todoID: number,
    todo: UpdateTodo,
  ): Promise<boolean> {
    logger.debug('Inside updateTodo model', { userID, todoID, todo });
    return await db.updateOne(table, {
      where: {
        id: todoID,
        user_id: userID,
      },
      data: {
        title: todo.title,
        description: todo.description,
        done: todo.done,
      },
    });
  }

  async function deleteTodo(userID: number, todoID: number): Promise<boolean> {
    logger.debug('Inside deleteTodo model', { userID, todoID });
    return await db.deleteOne(table, {
      where: {
        id: todoID,
        user_id: userID,
      },
    });
  }

  return {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
  };
}
