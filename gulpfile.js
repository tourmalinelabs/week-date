'use strict';

const Q = require('q');
const _ = require('lodash');
const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('test', done => {
    gulp.src('./test.js', { read: false }).pipe(mocha({ timeout: 10000 }));
});
