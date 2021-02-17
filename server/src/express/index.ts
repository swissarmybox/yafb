import express from 'express';
import type { Application } from 'express';
import type { Infras } from '../infras';
import type { Config } from '../configs/server';
import { configureMiddlewares } from './middlewares';
import { configureRoutes } from './routes';
import { createCatchAllError } from './errors/catchAll';

export function createApp(infras: Infras, config: Config): Application {
  const app = express();

  configureMiddlewares(infras.logger.http, app, config);
  configureRoutes(infras, app, config);

  app.use(createCatchAllError(infras.logger.error));

  return app;
}
