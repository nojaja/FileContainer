module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest',
  },
  testMatch: [
    '**/tests/unit/**/*.spec.{js,jsx,ts,tsx}',
  ],
};
