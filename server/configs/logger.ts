import winston from 'winston';
import Transport from 'winston-transport';

class NullTransport extends Transport {
  constructor(opts: any) {
    super(opts);
  }

  log(info: any, callback: () => void) {
    callback();
  }
}

export const logger = {
  test: {
    levels: winston.config.npm.levels,
    transports: [new NullTransport({})],
    exitOnError: false,
  },
  development: {
    levels: winston.config.npm.levels,
    transports: [
      new winston.transports.Console({
        level: 'info',
        format: winston.format.prettyPrint(),
      }),
    ],
    exitOnError: false,
  },
  production: {
    levels: winston.config.npm.levels,
    transports: [
      new winston.transports.Console({
        level: 'warn',
        format: winston.format.json(),
      }),
    ],
    exitOnError: false,
  },
};
