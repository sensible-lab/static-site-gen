process.env.NODE_ENV = 'development'

const path = require('path')

const express = require('express')
const morgan = require('morgan')
const jadeStatic = require('jade-static')

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpack = require('webpack')

const compiler = webpack(require('./webpack.config.js'))

const app = express()

app.use(morgan('dev'))
app.use(webpackDevMiddleware(compiler, {
  publicPath: '/assets'
}))

app.use(webpackHotMiddleware(compiler, {
  log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
}))

app.use(jadeStatic(path.join(__dirname, 'src', 'html')))

app.listen(3000)
