'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

var isWatching = false;

//gulp.task('test_coverage', function(done) {
//  gulp.src(['./**/*.js', '!node_modules/**/*', '!test/**/*'])
//    .pipe(istanbul())
//    .pipe(istanbul.hookRequire())
//    .on('finish', function() {
//      gulp.src('./test/**/*.js')
//        .pipe(mocha())
//        .once('error', function() {
//          process.exit(1);
//        })
//        .pipe(istanbul.writeReports())
//        .on('end', done);
//    });
//});

gulp.task('test', function(done) {
  return gulp.src(['./test/**/*.js'])
    .pipe(mocha())
    .once('error', function() {
      process.exit(1);
    });
});
