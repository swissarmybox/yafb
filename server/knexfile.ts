import path from 'path'

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
      directory: path.join(__dirname, 'migrations')
    }
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
      directory: path.join(__dirname, 'migrations')
    }
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
      directory: path.join(__dirname, 'migrations')
    }
  },
};
