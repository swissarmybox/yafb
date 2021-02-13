import path from 'path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import type { Application } from 'express';
import type { Env } from '../../common/types/env';
import { createHTTPLogger } from './httpLogger';

export function configureMiddlewares(
  httpLoggerFn: (meta: any) => void,
  app: Application,
  env: Env,
): void {
  if (env === 'production') {
    const staticDir = path.join(__dirname, '../../../client');
    app.use('/', express.static(staticDir));
  }

  app.use(helmet());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(createHTTPLogger(httpLoggerFn));
}
