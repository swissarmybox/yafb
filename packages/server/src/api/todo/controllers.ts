import type { Request, Response } from 'express';
import type { Infras } from '../../infras';
import { createModel } from './model';
import { createEngine } from './engine';
import * as schema from './schema';

export function createControllers(infras: Infras) {
  const { logger } = infras;
  const model = createModel(infras);
  const engine = createEngine(infras, model);

  async function getTodos(req: Request, res: Response): Promise<void> {
    const userID = (req as any).user.id;
    logger.debug('Inside getTodos controller', { userID });

    const todos = await engine.getTodos(userID);
    res.json({
      status: 'success',
      data: todos,
    });
  }

  async function getTodo(req: Request, res: Response): Promise<void> {
    const userID = (req as any).user.id;
    const todoID = await schema.todoID.validateAsync(req.params.id);
    logger.debug('Inside getTodo controller', { userID, todoID });

    const todo = await engine.getTodo(userID, todoID);
    res.json({
      status: 'success',
      data: todo,
    });
  }

  async function createTodo(req: Request, res: Response): Promise<void> {
    const userID = (req as any).user.id;
    const todo = await schema.newTodo.validateAsync(req.body);
    logger.debug('Inside createTodo controller', { userID, todo });

    const todoID = await engine.createTodo(userID, todo);
    res.json({
      status: 'success',
      data: todoID,
    });
  }

  async function updateTodo(req: Request, res: Response): Promise<void> {
    const userID = (req as any).user.id;
    const todoID = await schema.todoID.validateAsync(req.params.id);
    const todo = await schema.updateTodo.validateAsync(req.body);
    logger.debug('Inside updateTodo controller', { userID, todoID, todo });

    await engine.updateTodo(userID, todoID, todo);
    res.json({
      status: 'success',
      data: null,
    });
  }

  async function deleteTodo(req: Request, res: Response): Promise<void> {
    const userID = (req as any).user.id;
    const todoID = await schema.todoID.validateAsync(req.params.id);
    logger.debug('Inside deleteTodo controller', { userID, todoID });

    await engine.deleteTodo(userID, todoID);
    res.json({
      status: 'success',
      data: null,
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
