process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const compiler = webpack(require('./webpack.config.js'))
const spawnSync = require('child_process').spawnSync

compiler.run(function (err) {
  if (err) {
    throw err
  }

  const pug = spawnSync('pug', ['src/html', '-o', 'build', '-O', 'webpack-assets.json'], { encoding: 'utf8' })
  if (pug.stdout) {
    console.log(pug.stdout)
  } else {
    console.log(pug.stderr)
  }
})
