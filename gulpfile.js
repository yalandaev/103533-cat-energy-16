"use strict";

var gulp = require("gulp");
var del = require("del");
const webp = require("gulp-webp");
var posthtml = require("gulp-posthtml");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var svgSprite = require("gulp-svg-sprite");
var rename = require("gulp-rename");
var server = require("browser-sync").create();
var csso = require("gulp-csso");

gulp.task("copy", function() {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source/*ico",
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass({
      includePaths: require('node-normalize-scss').includePaths
    }))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});


gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml())
    .pipe(gulp.dest("build"));
});

gulp.task("svgsprite", function () {
  return gulp.src("source/img/*.svg")
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      },
    }
    ))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", () =>
  gulp.src("source/img/*.{png,jpg}")
    .pipe(webp({ quality: 80, lossless: true }))
    .pipe(gulp.dest("build/img"))
);
// //webp options: https://github.com/imagemin/imagemin-webp#imageminwebpoptions

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html", gulp.series("html")).on("change", server.reload);
});

gulp.task("build", gulp.series("clean", "copy", "html", "css", "svgsprite", "webp"));
gulp.task("start", gulp.series("build", "server"));
