import express from 'express';
import type { Application } from 'express';
import type { Infras } from '../_common/infras';
import type { Config } from '../_common/configs/server';
import { configureMiddlewares } from './middlewares';
import { configureRoutes } from './routes';
import { createCatchAllError } from './catchAll';

export function createApp(config: Config, infras: Infras): Application {
  const app = express();

  configureMiddlewares(config, infras.logger.http, app);
  configureRoutes(config, infras, app);

  app.use(createCatchAllError(infras.logger.error));

  return app;
}
