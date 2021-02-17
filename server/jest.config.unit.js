const baseJestConfig = require('./jest.config.js')

module.exports = {
  ...baseJestConfig,
  roots: ['./tests/unit'],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './reports',
        filename: 'unit.report.html',
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
  coverageDirectory: './reports/unit-coverage',
  coverageReporters: [
    'text',
    ['html'],
  ],
}
