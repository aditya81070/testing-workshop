module.exports = {
  moduleNameMapper: {
    '\\.module\\.css$': 'identity-obj-proxy',
    '\\.css$': require.resolve('./test/style-mock'),
  },
  setupTestFrameworkScriptFile: require.resolve('./test/setup-test-framework'),
  collectCoverageFrom: ['**/src/**/*.js'],
  coverageThreshold: {
    global: {
      statements: 18,
      functions: 19,
      branches: 10,
      lines: 18,
    },
  },
}
