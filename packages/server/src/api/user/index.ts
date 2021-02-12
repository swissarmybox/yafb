import express from 'express';
import type { Router } from 'express';
import type { Infras } from '../../infras';
import { wrapAsync } from '../../express/errors/wrapAsync';
import { createMiddlewares } from '../../auth/middlewares';
import { createControllers } from './controllers';

export function createRoutes(infras: Infras): Router {
  const router = express.Router();

  const { isAdmin } = createMiddlewares();
  const controller = createControllers(infras);

  router.get('/', wrapAsync(isAdmin), wrapAsync(controller.getUsers));
  router.get('/:id', wrapAsync(isAdmin), wrapAsync(controller.getUser));
  router.delete('/:id', wrapAsync(isAdmin), wrapAsync(controller.deleteUser));

  return router;
}
