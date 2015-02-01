'use strict';

var _ = require('lodash-node');
var gulp = require('gulp');
var glob = require('glob');
var path = require('path');
var cwd = process.cwd();

_.forEach(glob.sync('tools/tasks/*.js', {cwd: cwd}), function (filename) {
    require(path.resolve(cwd, filename))(gulp);
});

gulp.task('default', ['test']);
