'use strict';
var gulp = require('gulp');

require('./jshint');
require('./watch');

// set up the default task
gulp.task('default', ['watch']);
