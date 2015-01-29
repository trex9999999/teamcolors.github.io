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
var Handlebars      = require('handlebars');
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

// gulp.task('handlebars', function(){
//     var source = "<p>Hello, my name is {{name}}. I am from {{hometown}}. I have " +
//              "{{kids.length}} kids:</p>" +
//              "<ul>{{#kids}}<li>{{name}} is {{age}}</li>{{/kids}}</ul>";
//     //var source = require('../src/html/tmpl.hb');
//     var template = handlebars.compile(source);
     
//     var data = { "name": "Alan", "hometown": "Somewhere, TX",
//                  "kids": [{"name": "Jimmy", "age": "12"}, {"name": "Sally", "age": "4"}]};
//     var result = template(data);
//     console.log(result);
//     return gulp
//       .src(path.join(INPUT, 'html/tmpl.hb'))
//       .pipe()
//       .pipe(gulp.dest(path.join(OUTPUT, 'html')));
// });



// Handlebars
gulp.task('handlebars', function(){
    var templateData = {leagues: require('./src/data/team-data.json')};
    return gulp
        .src(path.join(INPUT, 'html/tmpl.hbs'))
        .pipe(handlebarsCompile(templateData))
        //.pipe(rename('hello.html'))
        .pipe(gulp.dest(path.join(OUTPUT, 'html')));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(path.join(INPUT, 'styles/*.scss'), ['sass']);
    gulp.watch(path.join(INPUT, 'html/*.hb'), ['handlebars']);
});

// Default Task
gulp.task('default', ['sass','watch', 'handlebars']);


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