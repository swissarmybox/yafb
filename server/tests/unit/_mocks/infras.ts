const logger = {
  debug: jest.fn(),
  http: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

const db = {
  disconnect: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
  deleteAll: jest.fn(),
  resetTable: jest.fn(),
};

export const infras = {
  logger,
  db,
};
