process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const _ = require('lodash')
const compiler = webpack(require('./webpack.config.js'))
const spawnSync = require('child_process').spawnSync

compiler.run(function (err) {
  if (err) {
    throw err
  }

  const webpackAssets = require('./webpack-assets.json')
  const locals = require('./src/locals.json')
  _.assign(webpackAssets, locals)
  
  const pug = spawnSync('pug', ['src/html', '-o', 'build', '-O', JSON.stringify(webpackAssets)], { encoding: 'utf8' })
  if (pug.stdout) {
    console.log(pug.stdout)
  } else {
    console.log(pug.stderr)
  }
})
