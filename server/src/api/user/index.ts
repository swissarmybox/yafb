import express from 'express';
import type { Router } from 'express';
import type { Infras } from '../../_common/infras';
import type { Config } from '../../_common/configs/server';
import { wrapAsync } from '../../_common/errors';
import { createMiddlewares } from '../../auth/middlewares';
import { createControllers } from './controllers';

export function createRoutes(config: Config, infras: Infras): Router {
  const router = express.Router();

  const { isAdmin } = createMiddlewares(config);
  const controller = createControllers(config, infras);

  router.get('/', wrapAsync(isAdmin), wrapAsync(controller.getUsers));
  router.get('/:id', wrapAsync(isAdmin), wrapAsync(controller.getUser));
  router.delete('/:id', wrapAsync(isAdmin), wrapAsync(controller.deleteUser));

  return router;
}
