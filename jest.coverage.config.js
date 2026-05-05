module.exports = {
  verbose: true,
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest',
  },
  testMatch: [
    '**/tests/unit/**/*.spec.{js,jsx,ts,tsx}',
    '**/tests/coverage/**/*.spec.{js,jsx,ts,tsx}',
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/tests/'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 50,
      functions: 50,
      branches: 50,
      statements: 50,
    },
  },
};
