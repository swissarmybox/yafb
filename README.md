# Yet Another Fullstack Boilerplate
 
Because the world surely needs another very opinionated fullstack TypeScript boilerplate. No fancy stuffs, no code generation. Just rip, tear, use as reference, or build.

This repo is highly opinionated, based on what I know of Fullstack Web Development using JavaScript/TypeScript so far, so expect this to evolve over the years. Some of the design decisions that influence this repo are Screaming Architecture, Domain Driven Design and Clean Architecture.

Technologies used:
- NodeJS
- ExpressJS
- TypeScript
- Parcel
- React
- PostgreSQL

## Getting Started

- Install [volta](https://volta.sh/) 
- Install PostgreSQL and make it live on port 5432
- Run `make bootstrap`

To run the app in development mode:

```
make dev -j2
```

See `Makefile` to discover more commands.

## TODO

- Docker to replace Volta and to containerize PostgreSQL
- Combine linting/formatting/gitignore
- E2E testing
- Shared modules
- Production build
