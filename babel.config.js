module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', {
        unstable_transformImportMeta: true
      }]
    ],
    plugins: [
      ['module-resolver', {
        root: ['./'],
        alias: { 
          '@': './',
          '@components': './components',
          '@constants': './constants',
          '@utils': './utils',
          '@store': './store',
          '@types': './types'
        }
      }],
      'expo-router/babel',
      'react-native-reanimated/plugin',
      'react-native-worklets-core/plugin'
    ]
  };
};
