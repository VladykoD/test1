const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const server = require('browser-sync').create();
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const fileinclude = require('gulp-file-include');
const del = require('del');
const uglify = require('gulp-uglify');

const html = () => {
  return gulp.src(['source/html/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@root',
      context: {
        test: 'text'
      }
    }))
    .pipe(gulp.dest('./'));
};

const css = () => {
  return gulp.src('source/sass/style.scss')
      .pipe(plumber())
      .pipe(sourcemap.init())
      .pipe(sass())
      .pipe(postcss([autoprefixer({
        grid: true,
      })]))
      .pipe(gulp.dest('./css'))
      .pipe(csso())
      .pipe(rename('style.min.css'))
      .pipe(sourcemap.write('.'))
      .pipe(gulp.dest('./css'))
      .pipe(server.stream());
};

const js = () => {
  return gulp.src(['source/js/*.js'])
    .pipe(gulp.dest('./js'))
    .pipe(uglify())
      .pipe(rename('index.min.js'))
      .pipe(gulp.dest('./js'))
};

const syncserver = () => {
  server.init({
    server: './',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch('source/html/**/*.html', gulp.series(html, refresh));
  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series(css));
  gulp.watch('source/js/**/*.{js,json}', gulp.series(js, refresh));
};

const refresh = (done) => {
  server.reload();
  done();
};

const clean = () => {
  return del(['css', 'js', 'index.html']);
};

const start = gulp.series(clean, css, js, html, syncserver);
exports.start = start;
