import Knex from 'knex';
import { Logger } from 'winston';
import { createLogger } from './logger';
import { createDB } from './db';

export type Infras = ReturnType<typeof createInfras>;

export function createInfras(knex: Knex, winstonLogger: Logger) {
  const db = createDB(knex);
  const logger = createLogger(winstonLogger);

  return {
    db,
    logger,
  };
}
