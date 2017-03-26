
// Base kyt config.
// Edit these properties to make changes.

const webpack = require('webpack');

module.exports = {
  reactHotLoader: true,
  debug: false,
  modifyWebpackConfig: function(config, options) {

    config.plugins.push(new webpack.DefinePlugin({
      'KYT.TYPE': JSON.stringify(options.type),
    }));
    return config;
  }
};
