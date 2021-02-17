import Knex from 'knex';
import winston from 'winston';
import * as configs from './_common/configs';
import { createInfras } from './_common/infras';
import { createApp } from './server';

type Env = 'test' | 'development' | 'production'

const env: Env = process.env.NODE_ENV as Env;
const serverConfig = configs.server[env];
const knexConfig = configs.db[env];
const winstonConfig = configs.logger[env];

const knex = Knex(knexConfig);
const winstonLogger = winston.createLogger(winstonConfig);

const infras = createInfras(knex, winstonLogger);
const app = createApp(serverConfig, infras);

const { host, port } = serverConfig;
const server = app.listen(port, () => {
  infras.logger.info(`Server listening at ${host}:${port}`);
});

export { infras, server };
