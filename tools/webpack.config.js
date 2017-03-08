var webpack = require('webpack');
var path = require('path');

var APP_DIR = path.resolve(__dirname, '../src/view');
var BUILD_DIR = path.resolve(__dirname, '../build');

var config = {
  // Since our build tools and modules are in DashFit/tools and not DashFit (root dir),
  // add the directory to be resolved so WebPack finds it
  resolve: {
    modules: [
      path.resolve(__dirname,'node_modules')
    ]
  },
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader',
        query: {
          // Presets have to be resolved since our node_modules is not at root
          presets: [
            'babel-preset-es2015',
            'babel-preset-react',
          ].map(require.resolve),
        }
      }
    ]
  }
}

module.exports = config;
