const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const root = path.resolve(__dirname, '..');
const projectRoot = __dirname;

/**
 * Metro configuration for Yarn Workspaces monorepo
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [root],

  resolver: {
    nodeModulesPaths: [path.resolve(root, 'node_modules')],
    extraNodeModules: {
      // Map the monorepo package to its source
      'react-native-appodeal': path.resolve(root, 'src'),
      'react': path.resolve(root, 'node_modules/react'),
      'react-native': path.resolve(root, 'node_modules/react-native'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
