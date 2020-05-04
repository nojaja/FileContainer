const path = require('path')
const src = __dirname + "/src"
const dist = __dirname + "/dist"
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: dist
  },
  context: src,
  entry: {
    main: './index.js',
  },
  output: {
    filename: 'bundle.js',
    sourceMapFilename: '[name].map',
    path: dist,
    publicPath:""
  },
  module: {
  }
}