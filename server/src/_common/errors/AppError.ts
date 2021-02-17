import { INTERNAL_SERVER } from './errTypes';

export class AppError extends Error {
  public name: string;
  public code: number;
  public message: string;
  public isOperational: boolean;

  constructor(
    message: string,
    error: {
      name: string;
      code: number;
      isOperational: boolean;
    } = INTERNAL_SERVER,
  ) {
    super();

    Object.setPrototypeOf(this, new.target.prototype);

    this.message = message;
    this.name = error.name;
    this.code = error.code;
    this.isOperational = error.isOperational;

    Error.captureStackTrace(this);
  }
}
