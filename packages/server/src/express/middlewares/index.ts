import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import type { Application } from 'express';
import { createHTTPLogger } from './httpLogger';

export function configureMiddlewares(
  httpLoggerFn: (meta: any) => void,
  app: Application,
): void {
  app.use(helmet());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(createHTTPLogger(httpLoggerFn));
}
