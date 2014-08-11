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

var paths = {
  app: [
    'src/app/support/*.coffee',
    'src/app/classes/player.coffee',
    'src/app/classes/computer.coffee',
    'src/app/classes/*.coffee',
    'src/app/data/*.coffee',
    'src/app/**/*.coffee'
  ],
  support: [
    'src/js/**/*.js'
  ],
  html: 'src/**/*.html',
  tests: 'spec/**/*.js',
  images: 'src/images/**/*',
  styles: 'src/sass/*.scss',
  templates: 'src/app/templates/**/*.hbs',
  clean: [
    'build/assets/css',
    'build/assets/js',
    'build/assets/images'
  ]
};

// Compile sass files
gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe(sass( { style: 'expanded' } ))
    .pipe(concat("styles.css"))
    .pipe(mincss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/assets/css'))
    .pipe(notify({message: "Styles task complete"}));
});

// Copy html into build folder.
gulp.task('html', function() {
  gulp.src(paths.html)
    .pipe(gulp.dest('build/'))
    .pipe(notify({message: "HTML task complete"}));
});

// Copy images into build folder.
gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(gulp.dest('build/assets/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Compile support js files
gulp.task('js', function() {
  gulp.src(paths.support)
    .pipe(concat('support.js'))
    .pipe(rename({suffix: '.min'}))
    // .pipe(uglify())
    .pipe(gulp.dest('build/assets/js'))
    .pipe(notify({message: "Scripts task complete"}));
});

// Compile coffeescript files
gulp.task('coffee', function() {
  gulp.src(paths.app)
    .pipe(cslint())
    .pipe(cslint.reporter())
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    // .pipe(uglify())
    .pipe(gulp.dest('build/assets/js'))
    .pipe(notify({message: "Scripts task complete"}));
});

// Precompile Handlebar Templates
gulp.task('templates', function(){
  gulp.src(paths.templates)
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
  return gulp.src(paths.clean, {read: false})
    .pipe(clean());
});

// Run tests
gulp.task('tests', function() {
  gulp.src(paths.tests)
    .pipe(jasmine());
});

// Watch for changes
gulp.task('watch', function() {
  gulp.watch(paths.app, ['coffee', 'tests']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.support, ['js', 'tests']);
  gulp.watch(paths.templates, ['templates', 'tests']);
});

// Default build
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'js', 'coffee', 'templates', 'images', 'html', 'tests', 'watch');
});
