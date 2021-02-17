import express from 'express';
import type { Router } from 'express';
import type { Infras } from '../../_common/infras';
import type { Config } from '../../_common/configs/server';
import { wrapAsync } from '../../_common/errors';
import { createMiddlewares } from '../../auth/middlewares';
import { createControllers } from './controllers';

export function createRoutes(config: Config, infras: Infras): Router {
  const router = express.Router();

  const { isLoggedIn } = createMiddlewares(config);
  const controller = createControllers(config, infras);

  router.get('/', wrapAsync(isLoggedIn), wrapAsync(controller.getTodos));
  router.get('/:id', wrapAsync(isLoggedIn), wrapAsync(controller.getTodo));
  router.post('/', wrapAsync(isLoggedIn), wrapAsync(controller.createTodo));
  router.put('/:id', wrapAsync(isLoggedIn), wrapAsync(controller.updateTodo));
  router.delete(
    '/:id',
    wrapAsync(isLoggedIn),
    wrapAsync(controller.deleteTodo),
  );

  return router;
}
