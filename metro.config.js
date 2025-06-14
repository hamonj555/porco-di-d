const { getDefaultConfig } = require('expo/metro-config');

// Ottieni la configurazione predefinita
const defaultConfig = getDefaultConfig(__dirname);

// Usa qualsiasi configurazione definita nelle 'app.json' o 'package.json'
// per estendere la configurazione predefinita.
defaultConfig.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter((ext) => ext !== 'svg');
defaultConfig.resolver.sourceExts = [...defaultConfig.resolver.sourceExts, 'svg'];

module.exports = defaultConfig;