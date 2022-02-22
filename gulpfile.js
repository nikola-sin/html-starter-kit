"use strict";

const { src, dest, parallel, series, watch } = require('gulp');
const gulpIF = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const del = require('del');
const argv = require('yargs').argv;

const isDev = (argv.development === undefined) ? false : true;
const isProd = !isDev;

// HTML
const html = () => {
  return src('./src/*.html')
  .pipe(gulpIF(isProd, htmlmin({
    useShortDoctype: true
  })))
  .pipe(dest('./dist/'));
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
};

const clean = () => {
  return del('./dist/');
};

exports.clean = clean;

exports.default = series(
  clean,
  html,
  style
);

exports.build = series(
  clean,
  html,
  style
);
