const baseJestConfig = require('./jest.config.js')

module.exports = {
  ...baseJestConfig,
  roots: ['<rootDir>/tests/unit'],
}
