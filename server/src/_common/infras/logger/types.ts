export interface Logger {
  http(meta: any): void;
  debug(text: string, meta?: any): void;
  info(text: string, meta?: any): void;
  warn(text: string, meta?: any): void;
  error(text: string, meta: any): void;
}
