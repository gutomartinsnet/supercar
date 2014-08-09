var gulp    = require('gulp'),
    gutil   = require('gulp-util'),
    clean   = require('gulp-clean'),
    rename  = require('gulp-rename'),
    concat  = require('gulp-concat'),
    notify  = require('gulp-notify'),
    jshint  = require('gulp-jshint'),
    uglify  = require('gulp-uglify'),
    coffee  = require('gulp-coffee'),
    declare = require('gulp-declare'),
    jasmine = require('gulp-jasmine'),
    sass    = require('gulp-ruby-sass'),
    cslint  = require("gulp-coffeelint"),
    mincss  = require('gulp-minify-css'),
    handle  = require('gulp-handlebars'),
    define  = require('gulp-define-module');

// Compile sass files
gulp.task('styles', function() {
  return gulp.src('src/sass/*.scss')
    .pipe(sass( { style: 'expanded' } ))
    .pipe(concat("styles.css"))
    .pipe(mincss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/assets/css'))
    .pipe(notify({message: "Styles task complete"}));
});

// Copy html into build folder.
gulp.task('html', function() {
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('build/'))
    .pipe(notify({message: "HTML task complete"}));
});

// Copy images into build folder.
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('build/assets/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Compile legacy js files
gulp.task('js', function() {
  gulp.src('src/js/**/*.js')
    .pipe(concat('support.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('build/assets/js'))
    .pipe(notify({message: "Scripts task complete"}));
});

// Compile coffeescript files
gulp.task('coffee', function() {
  gulp.src('src/app/**/*.coffee')
    .pipe(cslint())
    .pipe(cslint.reporter())
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('build/assets/js'))
    .pipe(notify({message: "Scripts task complete"}));
});

// Precompile Handlebar Templates
gulp.task('templates', function(){
  gulp.src('src/app/templates/**/*.hbs')
    .pipe(handle())
    .pipe(define('plain'))
    .pipe(declare({
      namespace: 'App.templates'
    }))
    .pipe(concat('templates.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/assets/js/'))
    .pipe(notify({message: "Templates task complete"}));
});

// Clean the build folder out
gulp.task('clean', function() {
  return gulp.src(['build/assets/css', 'build/assets/js', 'build/assets/images'], {read: false})
    .pipe(clean());
});

// Run tests
gulp.task('tests', function() {
  gulp.src('spec/**/*.js')
    .pipe(jasmine());
});

// Default build
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'js', 'coffee', 'templates', 'images', 'html', 'tests');
});
