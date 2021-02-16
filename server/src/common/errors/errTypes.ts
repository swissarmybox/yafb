export const NOT_FOUND = {
  name: 'NOT_FOUND_ERROR',
  code: 404,
  isOperational: true,
};

export const INTERNAL_SERVER = {
  name: 'INTERNAL_SERVER_ERROR',
  code: 500,
  isOperational: false,
};

export const INVALID_PARAMETER = {
  name: 'INVALID_PARAMETER_ERROR',
  code: 400,
  isOperational: true,
};

export const TOKEN_INVALID = {
  name: 'TOKEN_INVALID_ERROR',
  code: 400,
  isOperational: true,
};

export const UNAUTHORIZED = {
  name: 'UNAUTHORIZED_ERROR',
  code: 401,
  isOperational: true,
};

export const DUPLICATE_USER = {
  name: 'DUPLICATE_USER_ERROR',
  code: 409,
  isOperational: true,
};

export const FATAL = {
  name: 'FATAL_ERROR',
  code: 500,
  isOperational: false,
};
