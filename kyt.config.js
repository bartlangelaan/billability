
// Base kyt config.
// Edit these properties to make changes.

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  reactHotLoader: true,
  debug: false,
  modifyWebpackConfig: function(config, options) {

    console.log(config.module.rules.find(a => a.test.toString() == '/\\.css$/').use);
    // CLIENT
    if (options.type === 'client') {
      config.plugins.push(new HtmlWebpackPlugin({
        template: 'src/index.ejs',
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
