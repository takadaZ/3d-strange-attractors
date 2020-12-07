// import * as child from 'child_process';
// import * as gulp from 'gulp';
// import * as ts from 'gulp-typescript';
// import * as webpack from 'webpack-stream';
const child = require('child_process');
const { src, dest, parallel } = require('gulp');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

// const apps = '3d-attractor';

// function tsc() {
//   return parallel(
//     srcToDist,
//     bootstrap(apps),
//     webpack(apps),
//   );
// }

// gulp.task('tsc', () => {
//   const tsProject = ts.createProject('tsconfig.json');
//   return gulp
//     .src('./ts/**/*.ts')
//     .pipe(tsProject())
//     .pipe(gulp.dest('js'));
// });

// gulp.task('src-to-dist', () => {
//   return srcToDist();
// });

function cp() {
  return src('src/**/*')
    .pipe(dest('dist'));
}

function bootstrap() {
  return src('node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(dest('dist'));
}

function webpack() {
  return webpackStream(webpackConfig)
    .pipe(dest('dist'));
}

const build = parallel(cp, webpack, bootstrap);

// gulp.task('webpack', function () {
//   apps.forEach(name => webPack(name));
// });

function httpServer() {
  const platform = require('os').platform();
  let httpServer;
  if (platform === 'win32') {
    httpServer = child.spawn('http-server.cmd', ['./dist', '-p 80']);
  } else {
    httpServer = child.spawn('http-server', ['./dist']);
  }
  httpServer.stdout.on('data', (data) => {
    console.log(String(data));
  });
  httpServer.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
}

exports.cp = cp;
exports.bootstrap = bootstrap;
exports.webpack = webpack;
exports.default = build;
