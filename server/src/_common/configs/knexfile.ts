import path from 'path';

const migrationsDir = path.join(__dirname, '../../../migrations');
const seedsDir = path.join(__dirname, '../../../seeds');

module.exports = {
  test: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      database: 'yafb',
      user: 'yafb_admin',
      password: 'yafb_password',
    },
    pool: {
      min: 1,
      max: 1,
    },
    migrations: {
      directory: migrationsDir,
    },
    seeds: {
      directory: seedsDir,
    },
  },
  development: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      database: 'yafb',
      user: 'yafb_admin',
      password: 'yafb_password',
    },
    pool: {
      min: 1,
      max: 1,
    },
    migrations: {
      directory: migrationsDir,
    },
    seeds: {
      directory: seedsDir,
    },
  },
  production: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      database: 'yafb',
      user: 'yafb_admin',
      password: 'yafb_password',
    },
    pool: {
      min: 1,
      max: 1,
    },
    migrations: {
      directory: migrationsDir,
    },
    seeds: {
      directory: seedsDir,
    },
  },
};
