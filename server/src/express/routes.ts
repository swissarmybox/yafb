import express from 'express';
import type { Application, Router } from 'express';
import type { Infras } from '../infras';
import type { Config } from '../configs/server';
import { createRoutes as createAuthRoutes } from '../auth';
import { createRoutes as createUserRoutes } from '../api/user';
import { createRoutes as createTodoRoutes } from '../api/todo';

function createAPIRoutes(infras: Infras, config: Config): Router {
  const router = express.Router();

  router.use('/users', createUserRoutes(infras, config));
  router.use('/todos', createTodoRoutes(infras, config));

  return router;
}

export function configureRoutes(
  infras: Infras,
  app: Application,
  config: Config,
): void {
  app.get('/health', (req, res) => {
    res.sendStatus(200);
  });

  app.use('/auth', createAuthRoutes(infras, config));
  app.use('/api', createAPIRoutes(infras, config));

  if (config.env === 'production') {
    app.get('*', (req, res) => {
      res.redirect('/');
    });
  }
}
