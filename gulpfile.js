var gulp                   = require('gulp'); 
var gutil                  = require('gulp-util');
var del                    = require('del');
var jshint                 = require('gulp-jshint');
var sass                   = require('gulp-sass');
var concat                 = require('gulp-concat');
var uglify                 = require('gulp-uglify');
var rename                 = require('gulp-rename');
var autoprefixer           = require('gulp-autoprefixer') ;
var path                   = require('path');
var notify                 = require('gulp-notify');
var plumber                = require('gulp-plumber');
var Handlebars             = require('handlebars');
var handlebarsCompile      = require('gulp-compile-handlebars');

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

// Lint 
gulp.task('lint', function() {
    return gulp
        .src(path.join(INPUT, 'scripts/*.js'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Sass
gulp.task('sass', function() {
    return gulp
        .src(path.join(INPUT, 'styles/*.scss'))
        .pipe(handleError())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(path.join(OUTPUT, 'styles')));
});

// Concatenate & Minify JS
gulp.task('compile-js', function() {
    return gulp
        .src(path.join(INPUT, 'scripts/**'))
        .pipe(concat('main.js'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.join(OUTPUT, 'scripts')));
});

// Handlebars
gulp.task('handlebars', function(){
    var templateData = {leagues: require('./src/data/team-data.json')};
    return gulp
        .src(path.join(INPUT, 'html/tmpl.hbs'))
        .pipe(handlebarsCompile(templateData))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(path.join(OUTPUT)));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(path.join(INPUT, 'styles/*.scss'), ['sass']);
    gulp.watch(path.join(INPUT, 'html/*.hb'), ['handlebars']);
    gulp.watch(path.join(INPUT, 'scripts/*.js'), ['lint', 'compile-js']);
});

// Clean
gulp.task('clean', function (cb) {
  del([
    path.join(OUTPUT, '**'),
    path.join(OUTPUT, 'styles/*.*')
  ], cb);
});

// Default Task
gulp.task('default', ['clean'], function(){
    gulp.start(
        'sass',
        'handlebars', 
        'lint', 
        'compile-js',
        'watch'
    );
});

/*
 * Handlebars Helpers
 */
// Handlebars helpers
Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

Handlebars.registerHelper('hex2rgb', function(hex){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var rgb = {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    };
    return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
});