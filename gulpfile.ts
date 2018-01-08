import * as child from 'child_process';
import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as webpack from 'webpack-stream';

const webpackConfig = require('./webpack.config.js');

const apps = ['3d-attractor'];

gulp.task('default', ['tsc'], () => {
  srcToDist();
  apps.forEach(name => webPack(name));
});

gulp.task('tsc', () => {
  const tsProject = ts.createProject('tsconfig.json');
  return gulp
    .src('./ts/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest('js'));
});

gulp.task('src-to-dist', () => {
  return srcToDist();
});

function srcToDist() {
  return gulp
    .src('src/**/*')
    .pipe(gulp.dest('dist'));
}

function webPack(name: string) {
  return gulp
    .src([`./js/${name}/*.js`])
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(`./dist/${name}`));
}

gulp.task('webpack', function () {
  apps.forEach(name => webPack(name));
});

gulp.task('http-server', () => {
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
});
