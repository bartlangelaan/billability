
// Base kyt config.
// Edit these properties to make changes.

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  reactHotLoader: true,
  debug: false,
  modifyWebpackConfig: function(config, options) {

    // CLIENT
    if (options.type === 'client') {
      config.plugins.push(new HtmlWebpackPlugin({
        template: 'src/index.ejs',
        favicon: 'src/favicon.png',
      }));
      config.plugins.push(
        new webpack.LoaderOptionsPlugin({
          options: {
            postcss: [require('postcss-cssnext')],
            context: '/',
          },
        })
      );
    }

    // SERVER
    else {
      config.plugins.push(new webpack.DefinePlugin({
        'KYT.OPTIONS': JSON.stringify(options),
      }));
    }

    return config;
  }
};
