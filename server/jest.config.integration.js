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
  coverageDirectory: './reports/integration-coverage',
}
