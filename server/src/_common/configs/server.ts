export interface Config {
  env: 'test' | 'development' | 'production';
  port: number;
  host: string;
  tables: {
    user: string;
    role: string;
    todo: string;
  };
  auth: {
    cookie: string;
    expireIn: number;
    httpOnly: boolean;
    secure: boolean;
    secret: string;
    saltRounds: number;
  };
  roles: {
    admin: {
      id: number;
      name: string;
    };
    user: {
      id: number;
      name: string;
    };
  };
}

export const server: {
  test: Config;
  development: Config;
  production: Config;
} = {
  test: {
    env: 'test',
    port: 3000,
    host: 'http://localhost',
    tables: {
      user: 'users',
      role: 'roles',
      todo: 'todos',
    },
    auth: {
      cookie: 'jwt',
      expireIn: 300000,
      httpOnly: true,
      secure: false,
      secret: 'yafb_token',
      saltRounds: 10,
    },
    roles: {
      admin: {
        id: 1,
        name: 'admin',
      },
      user: {
        id: 2,
        name: 'user',
      },
    },
  },
  development: {
    env: 'development',
    port: 3000,
    host: 'http://localhost',
    tables: {
      user: 'users',
      role: 'roles',
      todo: 'todos',
    },
    auth: {
      cookie: 'jwt',
      expireIn: 300000,
      httpOnly: true,
      secure: false,
      secret: 'yafb_token',
      saltRounds: 10,
    },
    roles: {
      admin: {
        id: 1,
        name: 'admin',
      },
      user: {
        id: 2,
        name: 'user',
      },
    },
  },
  production: {
    env: 'production',
    port: 3000,
    host: 'http://localhost',
    tables: {
      user: 'users',
      role: 'roles',
      todo: 'todos',
    },
    auth: {
      cookie: 'jwt',
      expireIn: 300000,
      httpOnly: true,
      secure: false,
      secret: 'yafb_token',
      saltRounds: 10,
    },
    roles: {
      admin: {
        id: 1,
        name: 'admin',
      },
      user: {
        id: 2,
        name: 'user',
      },
    },
  },
};
