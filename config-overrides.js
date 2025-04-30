// config-overrides.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function override(config, env) {
  // 1) Safely remove CRA’s HtmlWebpackPlugin instances
  const plugins = Array.isArray(config.plugins) ? config.plugins : [];
  config.plugins = plugins.filter(
    plugin =>
      !(plugin.constructor && plugin.constructor.name === 'HtmlWebpackPlugin')
  );

  // 2) Define two entry points: home & about
  config.entry = {
    home: path.resolve(__dirname, 'src/index.jsx'),
    about: path.resolve(__dirname, 'src/about.jsx'),
  };

  // 3) Inject back two HTML templates
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html',
      chunks: ['home'],
      inject: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/about.html'),
      filename: 'about.html',
      chunks: ['about'],
      inject: true,
    })
  );

  return config;
};
