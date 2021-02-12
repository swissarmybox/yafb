import express from 'express';
import type { Application } from 'express';
import type { Infras } from '../infras';
import { configureMiddlewares } from './middlewares';
import { configureRoutes } from './routes';
import { createCatchAllError } from './errors/catchAll';

export function createApp(infras: Infras): Application {
  const app = express();

  configureMiddlewares(infras.logger.http, app);
  configureRoutes(infras, app);

  app.use(createCatchAllError(infras.logger.error));

  return app;
}
