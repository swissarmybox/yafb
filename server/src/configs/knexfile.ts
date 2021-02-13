import path from 'path';

const migrationsDir = path.join(__dirname, '../../migrations');

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
  },
};
