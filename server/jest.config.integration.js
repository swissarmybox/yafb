const baseJestConfig = require('./jest.config.js')

module.exports = {
  ...baseJestConfig,
  roots: ['<rootDir>/tests'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  // collectCoverageFrom: ['./','!./node_modules/'],
  // coverageTreshold: {
  //   global: {
  //     branches: 0,
  //     functions: 0,
  //     lines: 0,
  //     statements: 0,
  //   },
  // },
  // coverageDirectory: './reports/coverage',
  // coverageResporters: [
  //   'text',
  //   ['json', { file: 'api-sytem.json' }],
  // ],
  // repoters: [
  //   'default',
  //   [
  //     'jest-junit',
  //     {
  //       outputDirectory: 'reportes/test',
  //       outputName: 'api.system.test.xml',
  //     }
  //   ],
  // ]
}
