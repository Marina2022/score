import gulp from "gulp";
import plumber from "gulp-plumber";
import sass from "gulp-dart-sass";
import browser from "browser-sync";
import sourcemaps from "gulp-sourcemaps";
import del from "gulp-clean";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";

export const clean = () => {
  return gulp.src("build").pipe(del({ force: true }));
};

const scripts = () => {
  return gulp
    .src("source/js/**/*.js")
    //.pipe(terser())  // минификатор js
    .pipe(gulp.dest("build/js"))
    .pipe(browser.stream());
};

export const html = () => {
  return gulp
    .src("source/**/*.html")
    //.pipe(htmlmin({ collapseWhitespace: true }))  // это минифай
    .pipe(gulp.dest("build"));
};

export const styles = () => {
  return gulp
    .src("source/sass/**/*.+(scss|sass|sass)", { sourcemaps: true })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("build/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

// Watcher


const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/**/*.html").on("change", gulp.series(html, browser.reload));
  gulp.watch("source/sass/**/*.sass").on("change", gulp.series(copy, browser.reload));
  gulp.watch("source/js/**/*.js").on("change", gulp.series(scripts));
  gulp.watch("source/img/**/*").on("all", gulp.series(copy, browser.reload));
  //gulp.watch("source/img/**/*").on("all", gulp.series(optimizeImg));

};

export const copy = () => {
  return gulp
    .src(["source/assets/*", "source/*.ico", "source/img/**",  "source/js/**/*.js","source/img/*"], {
      base: "source",
    })
    .pipe(gulp.dest("build"));
};

export default gulp.series(
  clean,
  copy,
  styles,
  html,
  scripts,
  //copyImg,
  //makeWebp,
  server,
  watcher
);
