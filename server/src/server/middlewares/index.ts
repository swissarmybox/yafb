import path from 'path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import type { Application } from 'express';
import type { Config } from '../../_common/configs/server';
import { createHTTPLogger } from './httpLogger';

export function configureMiddlewares(
  config: Config,
  httpLoggerFn: (meta: any) => void,
  app: Application,
): void {
  if (config.env === 'production') {
    const staticDir = path.join(__dirname, '../../../client');
    app.use('/', express.static(staticDir));
  }

  app.use(helmet());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(createHTTPLogger(httpLoggerFn));
}
