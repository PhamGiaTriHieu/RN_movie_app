const {getDefaultConfig} = require('expo/metro-config');
const {withNativeWind} = require('nativewind/metro');

const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

let config = getDefaultConfig(__dirname);

config = withNativeWind(config, {input: './app/global.css'});

config = wrapWithReanimatedMetroConfig(config);

// module.exports = withNativeWind(config, {input: './app/global.css'});
module.exports = config;
