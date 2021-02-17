const baseJestConfig = require('./jest.config.js')

module.exports = {
  ...baseJestConfig,
  roots: ['./tests/integration'],
  setupFilesAfterEnv: ['./tests/integration/setup.ts'],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './reports',
        filename: 'integration.report.html',
        expand: true
      },
    ]
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    './src/**/*.ts',
    '!./node_modules/',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  coverageDirectory: './reports/integration-coverage',
  coverageReporters: [
    'text',
    ['html'],
  ],
}
