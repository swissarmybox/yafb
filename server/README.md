# Yet Another Fullstack Boilerplate

Because the world surely needs another very opinionated fullstack TypeScript boilerplate. No fancy stuffs, no code generation. Just rip, tear, use as reference, or build.

Opinion:
- Screaming Architecture (DDD)
- Clean Architecture
- Client Server Architecture
- Backend Express
- Frontend React

## Technology

- NodeJS 14
- PostgreSQL 

## Migration

Using PostgreSQL, create the database. Run `psql` shell and type

```
CREATE DATABASE yafb;
CREATE USER yafb_admin WITH ENCRYPTED PASSWORD 'yafb_password';
GRANT ALL PRIVILEGES ON DATABASE yafb TO yafb_admin;
```

See knex guide to add more

```
production: {
}

staging: {
}
```

## TODO

- Upgrade to Jest 27 to make use of CustomEnvironment in TypeScript, replacing `tests/integration/setup.ts`

- Server:
  - Database
  - Log
  - API schema validator
  - Todo API
  - Error handling
  - Unit Testing
  - Integration Testing
  - Graceful shutdown

- Client
  - Dev server
  - React/Redux

- All:
  - Linting
  - Prettifying
  - Deployment build
  - E2E
  - (maybe) Docker
