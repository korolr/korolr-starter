/* eslint-disable */

var gulp = require("gulp"),
  gutil = require("gulp-util"),
  browserSync = require("browser-sync"),
  concat = require("gulp-concat"),
  nunjucksRender = require("gulp-nunjucks-render"),
  plumber = require("gulp-plumber"),
  htmlbeautify = require("gulp-html-beautify"),
  child_process = require("child_process");
imagemin = require("gulp-imagemin");

function buildWebpack(done) {
  const buildProcess = child_process.spawn(
    /^win/.test(process.platform) ? "webpack.cmd" : "webpack",
  );
  buildProcess.on("close", code => {
    console.log(`webpack process finished with code ${code}`);
    done();
  });
}

function nunjucks() {
  return gulp
    .src("app/njk/*.njk")
    .pipe(plumber())
    .pipe(
      nunjucksRender({
        path: ["app/njk"],
      }),
    )
    .pipe(htmlbeautify())
    .pipe(gulp.dest("out"))
    .pipe(browserSync.reload({ stream: true }));
}

function img() {
  return gulp
    .src("app/img/**/*")
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest("out/img"));
}

// Сервер и автообновление страницы Browsersync
gulp.task("browser-sync", function(done) {
  browserSync({
    server: {
      baseDir: "out",
    },
    notify: false,
    // tunnel: true,
    // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
  });
  gulp.watch("app/njk/**/*.njk", gulp.series("nunjucks"));
  gulp.watch("app/img/*", gulp.series("img"));
  gulp.watch("app/scss/**/*.scss", gulp.series("webpack-refresh"));
  gulp.watch(
    ["libs/**/*.js", "app/js/**/*.js"],
    gulp.series("webpack-refresh"),
  );
  gulp.watch("out/**/*.html", browserSync.reload);
  done();
});

gulp.task("refresh", function(done) {
  browserSync.reload();
  done();
});

gulp.task("img", img);
gulp.task("nunjucks", nunjucks);
gulp.task("webpack", buildWebpack);
gulp.task("webpack-refresh", gulp.series("webpack", "refresh"));
gulp.task("build", gulp.series("webpack", "nunjucks", "img"));
gulp.task("run", gulp.series("build", "browser-sync"));
