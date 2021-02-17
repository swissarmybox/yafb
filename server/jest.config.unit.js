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
  coverageDirectory: './reports/unit-coverage',
}
