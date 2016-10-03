'use strict'

const path = require('path')

const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')

const ENV = process.env.NODE_ENV

const config = {
  // Entry point for static analyzer
  context: path.resolve(__dirname, 'src', 'js'),
  entry: {
    main: ['./main.js']
  },

  output: {
    // Where to build results
    path: path.resolve(__dirname, 'build', 'assets'),

    // Filename to use in HTML
    filename: '[name].js',

    // Path to use in HTML
    publicPath: '/assets/'
  },

  resolve: {
    // Absolute path that contains modules
    root: __dirname,

    // Directory names to be searched for modules
    modulesDirectories: ['node_modules']
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: require.resolve('jquery'), loader: 'expose?$!expose?jQuery' },
      { test: /\.jade$/, loader: 'pug' },
      { test: /\.json$/, loaders: ['json'] },
      { test: /\.png$/, loader: 'url?limit=8192&mimetype=image/png' },
      { test: /\.jpe?g$/, loader: 'url?limit=8192&mimetype=image/jpg' },
      { test: /\.gif$/, loader: 'url?limit=8192&mimetype=image/gif' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&mimetype=image/svg+xml' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&mimetype=application/font-woff2' },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' }
    ]
  },

  plugins: [new webpack.optimize.OccurenceOrderPlugin()]
}

if (ENV === 'production') {
  config.output.filename = '[name]-[hash].js'
  config.plugins.push(new ExtractTextPlugin('[name]-[hash].css'))
  config.plugins.push(new AssetsPlugin({ path: path.join(__dirname) }))
  config.module.loaders.push({ test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') })
  config.module.loaders.push({
    test: /\.less$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
  })
  config.plugins.push(new webpack.optimize.UglifyJsPlugin())
} else {
  config.module.loaders.push({ test: /\.css$/, loaders: ['style-loader', 'css-loader'] })
  config.module.loaders.push({ test: /\.less$/, loaders: ['style-loader', 'css-loader', 'less-loader'] })
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  config.plugins.push(new webpack.NoErrorsPlugin())
  config.entry.main.push('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true')
}

module.exports = config
