const baseJestConfig = require('./jest.config.js')

module.exports = {
  ...baseJestConfig,
  roots: ['<rootDir>/tests/unit'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'reports',
        outputName: 'unit.test.xml',
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
    ['json', { file: 'unit.coverage.json' }],
  ],
}
