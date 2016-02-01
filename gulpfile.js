//////////////////////////////////////////////////
// REQUIRED
//////////////////////////////////////////////////

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    rimraf = require('gulp-rimraf'), // new version of gulp-clean
    put = require('gulp-put'), // copies while maintaining directory structure
    pngquant = require('imagemin-pngquant'),
    browserSync = require('browser-sync').create();

var onError = function(err) {
  gutil.beep();
  console.log(err);
  this.emit('end');
}


//////////////////////////////////////////////////
// CONFIG
//////////////////////////////////////////////////

// Location of main Sass file for author custom
var cssSrc = 'css/main.scss';

// Directory to which all build files will be compiled
// var buildDir = '_build';

// Files to be copied to build directory
// var destFiles = [
//     'dest/js/*.js',
//     'dest/css/*.css',
//     'dest/img/*',
// ];

//////////////////////////////////////////////////
// TASKS
//////////////////////////////////////////////////

gulp.task('css', function () {
  return gulp.src('dev/css/*.scss')
    .on('error', sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('build/css'))
});

gulp.task('js', function(){
  return gulp.src('dev/js/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'))
});

gulp.task('images', function(){
  return gulp.src('dev/img/*')
    .pipe(imagemin({
      progressive:true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('build/img'));
});

gulp.task('watch', function(){
  gulp.watch('dev/js/*.js', ['js'])
  gulp.watch('dev/css/*.scss', ['css'])
});

gulp.task('clean', function() {
    return gulp.src(buildDir, {read: false})
        .pipe(rimraf());
});

// gulp.task('build', ['js', 'css', 'images', 'clean'], function() {
//     return gulp.src(destFiles)
//         .pipe(put(buildDir));
// });

////// BrowserSync Static server

gulp.task('serve', ['css', 'js', 'images'], function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('dev/js/*.js', ['js']);
    gulp.watch('dev/css/*.scss', ['css']);
    gulp.watch('*.html').on('change', browserSync.reload);
});

////// BrowserSync all browsers

gulp.task('serveall', ['css', 'js', 'images'], function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        browser: ["google chrome", "firefox", "safari"]
    });

    gulp.watch('dev/js/*.js', ['js']);
    gulp.watch('dev/css/*.scss', ['css']);
    gulp.watch('*.html').on('change', browserSync.reload);
});

////////

gulp.task('default', ['js', 'css', 'images', 'watch']);