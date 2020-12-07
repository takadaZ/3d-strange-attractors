const child = require('child_process');
const { src, dest, parallel } = require('gulp');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

function cp() {
  return src('src/**/*')
    .pipe(dest('docs'));
}

function bootstrap() {
  return src('node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(dest('docs'));
}

function webpack() {
  return webpackStream(webpackConfig)
    .pipe(dest('docs'));
}

const build = parallel(cp, webpack, bootstrap);

exports.cp = cp;
exports.bootstrap = bootstrap;
exports.webpack = webpack;
exports.default = build;
