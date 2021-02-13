import express from 'express';
import type { Application, Router } from 'express';
import type { Infras } from '../infras';
import type { Env } from '../common/types/env';
import { createRoutes as createAuthRoutes } from '../auth';
import { createRoutes as createUserRoutes } from '../api/user';
import { createRoutes as createTodoRoutes } from '../api/todo';

function createAPIRoutes(infras: Infras): Router {
  const router = express.Router();

  router.use('/users', createUserRoutes(infras));
  router.use('/todos', createTodoRoutes(infras));

  return router;
}

export function configureRoutes(
  infras: Infras,
  app: Application,
  env: Env,
): void {
  app.get('/health', (req, res) => {
    res.sendStatus(200);
  });

  app.use('/auth', createAuthRoutes(infras));
  app.use('/api', createAPIRoutes(infras));

  if (env === 'production') {
    app.get('*', (req, res) => {
      res.redirect('/');
    });
  }
}
