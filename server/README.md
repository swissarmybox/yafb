# Server

The server side code for the fullstack boilerplate.

Technologies used:
- NodeJS
- ExpressJS
- TypeScript
- PostgreSQL

## Migration

Using PostgreSQL, create the database. Run `psql` shell and type

```
CREATE DATABASE yafb;
CREATE USER yafb_admin WITH ENCRYPTED PASSWORD 'yafb_password';
GRANT ALL PRIVILEGES ON DATABASE yafb TO yafb_admin;
```

## TODO

- Upgrade to Jest 27 to make use of CustomEnvironment in TypeScript, replacing `tests/integration/setup.ts`
- Graceful shutdown
- Documentation (both functions and API)
