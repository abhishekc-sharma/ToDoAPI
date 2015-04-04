'use strict';
var gulp = require('gulp');

require('./jshint');
require('./watch');
require('./test');

// set up the default task
gulp.task('default', ['watch']);
