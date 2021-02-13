import * as knexConfig from './knexfile';

export const db = {
  test: (knexConfig as any).test,
  development: (knexConfig as any).development,
  production: (knexConfig as any).production,
};
