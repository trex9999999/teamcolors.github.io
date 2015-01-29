var gulp            = require('gulp'); 
var gutil           = require('gulp-util');
//var jshint          = require('gulp-jshint');
var sass            = require('gulp-sass');
//var concat          = require('gulp-concat');
//var uglify          = require('gulp-uglify');
var rename          = require('gulp-rename');
var autoprefixer    = require('gulp-autoprefixer') ;
var path            = require('path');
var notify          = require('gulp-notify');
var plumber         = require('gulp-plumber');
//var del             = require('del');

var INPUT = 'src';
var OUTPUT = 'public';
var PORT   = 3000;


function handleError() {
  return plumber({
    errorHandler: notify.onError(function() {
      gutil.beep();
      return 'Error: <%= error.message %>';
    })
  });
}

// Clean
// gulp.task('clean', function(cb) {
//     del([path.join(OUTPUT), '**/*'], cb)
// });

// Lint Task
// gulp.task('lint', function() {
//     return gulp
//         .src(path.join(INPUT, 'scripts/*.js'))
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });

// Compile Our Sass
gulp.task('sass', function() {
    return gulp
        .src(path.join(INPUT, 'styles/*.scss'))
        .pipe(handleError())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(path.join(OUTPUT, 'styles')));
});

// Concatenate & Minify JS
// gulp.task('scripts', function() {
//     return gulp.src('js/*.js')
//         .pipe(concat('all.js'))
//         .pipe(gulp.dest('dist'))
//         .pipe(rename('all.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('dist'));
// });

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(path.join(INPUT, 'styles/*.scss'), ['sass']);
});

// Default Task
gulp.task('default', ['sass','watch']);
// gulp.task('default', ['clean'], function() {
//     gulp.start('sass', 'watch');
// });

// gulp.task('dev', ['clean'], function() {
//   gulp.start(
//     'sass',
//     'watch'
//   );
// });

// gulp.task('default', ['dev']);
