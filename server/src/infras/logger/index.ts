import type { Logger as WinstonLogger } from 'winston';
import type { Logger } from './types'

export function createLogger(winstonLogger: WinstonLogger): Logger {
  function http(meta: any): void {
    winstonLogger.info('HTTP Access Log', meta);
  }

  function debug(text: string, meta?: any): void {
    winstonLogger.debug(text, meta);
  }

  function info(text: string, meta?: any): void {
    winstonLogger.info(text, meta);
  }

  function warn(text: string, meta?: any): void {
    winstonLogger.warn(text, meta);
  }

  function error(text: string, meta: any): void {
    winstonLogger.error(text, meta);
  }

  return {
    http,
    debug,
    info,
    warn,
    error,
  };
}
