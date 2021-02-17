import express from 'express';
import type { Application, Router } from 'express';
import type { Infras } from '../infras';
import type { Config } from '../configs/server';
import { createRoutes as createAuthRoutes } from '../auth';
import { createRoutes as createUserRoutes } from '../api/user';
import { createRoutes as createTodoRoutes } from '../api/todo';

function createAPIRoutes(config: Config, infras: Infras): Router {
  const router = express.Router();

  router.use('/users', createUserRoutes(config, infras));
  router.use('/todos', createTodoRoutes(config, infras));

  return router;
}

export function configureRoutes(
  config: Config,
  infras: Infras,
  app: Application,
): void {
  app.get('/health', (req, res) => {
    res.sendStatus(200);
  });

  app.use('/auth', createAuthRoutes(config, infras));
  app.use('/api', createAPIRoutes(config, infras));

  if (config.env === 'production') {
    app.get('*', (req, res) => {
      res.redirect('/');
    });
  }
}
