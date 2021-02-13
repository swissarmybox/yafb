import express from 'express';
import type { Application } from 'express';
import type { Infras } from '../infras';
import type { Env } from '../common/types/env';
import { configureMiddlewares } from './middlewares';
import { configureRoutes } from './routes';
import { createCatchAllError } from './errors/catchAll';

export function createApp(infras: Infras, env: Env): Application {
  const app = express();

  configureMiddlewares(infras.logger.http, app, env);
  configureRoutes(infras, app, env);

  app.use(createCatchAllError(infras.logger.error));

  return app;
}
