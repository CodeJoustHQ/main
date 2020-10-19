const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = function override(config, _) {
  config.plugins.push(new MonacoWebpackPlugin());
  return config;
};
