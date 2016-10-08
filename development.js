process.env.NODE_ENV = 'development'

const path = require('path')
const fs = require('fs')

const express = require('express')
const VError = require('verror')
const _ = require('lodash')
const morgan = require('morgan')
const expressPug = require('express-pug')

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

app.use(function (req, res, next) {
  fs.readFile(path.join(__dirname, 'src', 'locals.json'), 'utf8', function (err, data) {
    if (err) {
      return next(new VError(err, 'error reading file locals.json'))
    }
    const locals = JSON.parse(data)
    _.assign(res.locals, locals)
    next()
  })
})

app.use(expressPug({
  root: path.join(__dirname, 'src', 'html')
}))

app.listen(3000)
