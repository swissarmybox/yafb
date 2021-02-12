import express from 'express';
import type { Router } from 'express';
import type { Infras } from '../infras';
import { wrapAsync } from '../express/errors/wrapAsync';
import { createMiddlewares } from './middlewares';
import { createControllers } from './controllers';

export function createRoutes(infras: Infras): Router {
  const router = express.Router();

  const { isLoggedIn } = createMiddlewares();
  const controllers = createControllers(infras);

  router.get(
    '/profile',
    wrapAsync(isLoggedIn),
    wrapAsync(controllers.getProfile),
  );
  router.post('/register', wrapAsync(controllers.registerUser));
  router.post('/login', wrapAsync(controllers.login));
  router.post('/logout', wrapAsync(controllers.logout));
  router.patch(
    '/password',
    wrapAsync(isLoggedIn),
    wrapAsync(controllers.changePassword),
  );

  return router;
}
