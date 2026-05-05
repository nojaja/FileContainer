module.exports = {
  verbose: true ,
  transform: {
    '^.+\\.(js|ts)$'  : 'babel-jest'
  },
  testMatch: [
    '**/tests/unit/**/*.spec.{js,jsx,ts,tsx}',
    '**/tests/coverage/**/*.spec.{js,jsx,ts,tsx}',
    '**/__tests__/*.{js,jsx,ts,tsx}'
  ]
}
