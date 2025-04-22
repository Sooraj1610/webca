const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

// Updated Paths (based on your current structure)
const paths = {
  styles: 'css/**/*.css',
  scripts: 'js/**/*.js',
  images: 'images/**/*.{png,jpg,jpeg,gif,svg}',
  html: './*.html'
};

// Clean dist folder
async function clean() {
  const del = (await import('del')).deleteAsync;
  return del(['dist']);
}

// Styles
function styles() {
  return src(paths.styles)
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

// Scripts
function scripts() {
  return src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());
}

// Images
async function images() {
  const imagemin = (await import('gulp-imagemin')).default;
  return src(paths.images)
    .pipe(imagemin())
    .pipe(dest('dist/images'));
}

// BrowserSync server for HTML
function serve() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });

  watch(paths.styles, styles);
  watch(paths.scripts, scripts);
  watch(paths.images, images);
  watch(paths.html).on('change', browserSync.reload);
}

// Default task
exports.default = series(clean, parallel(styles, scripts, images), serve);