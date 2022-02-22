"use strict";

const { src, dest, parallel, series, watch } = require('gulp');
const gulpIF = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
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

const clean = () => {
  return del('./dist/');
};

exports.clean = clean;

exports.default = series(
  clean,
  html
);

exports.build = series(
  clean,
  html
);
