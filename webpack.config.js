var path = require('path');

module.exports = {
  entry: {
    index: './client/index.js',
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  },
  resolve: {
    extensions: ['', '.js', 'index.js', '.css', 'style.css']
  },
  module: {
    loaders: [
      {
        test: /\.js/,
        exclude: /(node_modules)/,
        loader: 'babel-loader?cacheDirectory=true'
      },
      {
        test: /\.jsx/,
        exclude: /(node_modules)/,
        loader: 'babel-loader?cacheDirectory=true'
      }
    ]
  }
};