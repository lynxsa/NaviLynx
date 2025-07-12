// https://docs.expo.dev/guides/using-eslint/
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
  recommendedConfig: null,
  allConfig: null,
});

module.exports = [
  {
    ignores: [
      'dist/**', 
      'scripts/**', 
      'node_modules/**', 
      'build/**', 
      'react-compiler-runtime.js',
      'jest.setup.js',
      'test-context.js'
    ]
  },
  ...compat.extends('expo'),
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    rules: {
      'react-native-text-watcher/no-raw-text': 'off',
      'react-native-text-watcher/enforce-wrapper': 'off',
    },
  },
];
