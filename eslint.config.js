// https://docs.expo.dev/guides/using-eslint/
const expoConfig = require('eslint-config-expo');

module.exports = {
  extends: ['expo'],
  ignorePatterns: ['dist/*', 'scripts/*'],
  rules: {
    'react-native-text-watcher/no-raw-text': 'off',
    'react-native-text-watcher/enforce-wrapper': 'off',
  },
};
