module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-reanimated|react-native-worklets|react-native-safe-area-context|react-native-svg|react-redux|@reduxjs/toolkit|redux-persist|redux|immer)/)',
  ],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
  },
  modulePathIgnorePatterns: ['<rootDir>/node_modules/.pnpm'],
};
