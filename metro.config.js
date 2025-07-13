// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('cjs');          // tell Metro about .cjs
config.resolver.unstable_enablePackageExports = false; // guards old Node export map bug

module.exports = config;
