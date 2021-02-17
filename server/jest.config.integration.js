const baseJestConfig = require('./jest.config.js')

module.exports = {
  ...baseJestConfig,
  roots: ['<rootDir>/tests/integration'],
  setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.ts'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'reports',
        outputName: 'integration.test.xml',
      }
    ],
  ],
  collectCoverageFrom: ['./src','!./node_modules/'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  coverageDirectory: './reports',
  coverageReporters: [
    'text',
    ['json', { file: 'integration.coverage.json' }],
  ],
}
