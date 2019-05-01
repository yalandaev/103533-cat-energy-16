"use strict";

var gulp = require("gulp");
const webp = require('gulp-webp');
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var svgSprite = require('gulp-svg-sprite');
var server = require("browser-sync").create();
const filter = require('gulp-filter');

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass({
      includePaths: require('node-normalize-scss').includePaths
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task('svgsprite', function () {
  return gulp.src('source/img/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      },
    }
    ))
    .pipe(gulp.dest('source/img/sprites'));
});

gulp.task('webp-png', () =>
  gulp.src('source/img/*.png')
    .pipe(webp({ quality: 80, lossless: true }))
    .pipe(gulp.dest('source/img/webp'))
);

gulp.task('webp-jpg', () =>
  gulp.src('source/img/*.jpg')
    .pipe(webp({ quality: 80, lossless: true }))
    .pipe(gulp.dest('source/img/webp'))
);
//webp options: https://github.com/imagemin/imagemin-webp#imageminwebpoptions

gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("start", gulp.series("css", "svgsprite", "webp-png", "webp-jpg", "server"));
