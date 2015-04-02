'use strict';

var gulp = require('gulp');


gulp.task('watch', function() {
  // Watch js files: lint
  gulp.watch(['./**/*.js', '!node_modules/**/*'], ['jshint']);
});
