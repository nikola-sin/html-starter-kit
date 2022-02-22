"use strict";

const { src, dest, parallel, series, watch, once } = require('gulp');
const gulpIF = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const del = require('del');
const argv = require('yargs').argv;
const browserSync = require('browser-sync');

const isDev = (argv.development === undefined) ? false : true;
const isProd = !isDev;

// HTML
const html = () => {
  return src('./src/*.html')
  .pipe(gulpIF(isProd, htmlmin({
    useShortDoctype: true
  })))
  .pipe(dest('./dist/'))
  .pipe(browserSync.stream())
};

// Sass
const style = () => {
  return src('./src/scss/*.scss')
  .pipe(gulpIF(isDev, sourcemaps.init()))
  .pipe(gulpIF(isProd, autoprefixer()))
  .pipe(sass().on('error', sass.logError))
  .pipe(gulpIF(isProd, csso({
    forceMediaMerge: true
  })))
  .pipe(gulpIF(isDev, sourcemaps.write()))
  .pipe(dest('./dist/'))
  .pipe(browserSync.stream())
};

// Scripts
const script = () =>{
  return src('./src/js/script.js')
  .pipe(webpackStream(webpackConfig, webpack))
  .pipe(dest('./dist/js/'))
  .pipe(browserSync.stream())
};

// Copy
const copy = () => {
  return src([
    './src/img/**/*.{jpg,png,webp,gif,ico}',
    './src/fonts/**/*.{woff,woff2,eot,ttf}'
  ], { base: 'src'})
  .pipe(dest('./dist/'))
  .pipe(browserSync.stream({ once: true }))
};

// Watch
const watcher = () => {
  watch('./src/*.html', series(html));
  watch('./src/scss/**/*.scss', series(style));
  watch('./src/js/**/*.js', series(script));
  watch([
    './src/img/**/*.{jpg,png,webp,gif,ico}',
    './src/fonts/**/*.{woff,woff2,eot,ttf}'
  ], series(copy));
};

// Browser Sync
const bSync = () => {
  browserSync.init({
    ui: false,
    notify: false,
    open: false,
    server: {
      baseDir: './dist/'
    }
  });
};

const clean = () => {
  return del('./dist/');
};

exports.clean = clean;

exports.default = series(
  clean,
  html,
  style,
  script,
  copy,
  parallel(
    bSync,
    watcher
  )
);

exports.build = series(
  clean,
  html,
  style,
  script,
  copy
);
