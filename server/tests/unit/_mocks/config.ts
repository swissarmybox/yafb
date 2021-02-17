interface Config {
  env: 'test' | 'development' | 'production';
  port: number;
  host: string;
  tables: {
    user: string;
    role: string;
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

export const config: Config = {
  env: 'test',
  port: 3000,
  host: 'http://localhost',
  tables: {
    user: 'users',
    role: 'roles',
  },
  auth: {
    cookie: 'jwt',
    expireIn: 3000000,
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
}
