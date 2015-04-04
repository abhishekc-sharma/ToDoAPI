'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('jshint', function() {
  // Lint all own js files in project
  return gulp.src(['./**/*.js', '!node_modules/**/*', '!coverage/**/*'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
