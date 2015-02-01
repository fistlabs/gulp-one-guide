'use strict';

var gulpMocha = require('gulp-mocha');
var gulpIstanbul = require('gulp-istanbul');
var filesToCover = [
    'gulp-one-guide.js'
];

module.exports = function (gulp) {
    gulp.task('unit', [], runMochaTests);
    gulp.task('cover', [], runTestsAndCover);
    gulp.task('test', ['lint'], runTestsAndCover);
};

function runTestsAndCover(done) {
    var self = this;
    this.src(filesToCover).
        //  cover files
        pipe(gulpIstanbul()).
        //  hook require for testing suite to require covered files
        pipe(gulpIstanbul.hookRequire()).
        on('finish', function () {
            // run tests
            runMochaTests.call(self).
                //  write coverage reports
                pipe(gulpIstanbul.writeReports()).
                on('end', done);
        });
}

function runMochaTests() {
    var mochaSuiteStream = gulpMocha({
        ui: 'bdd',
        reporter: 'spec',
        checkLeaks: true,
        slow: Infinity
    });
    var t2 = this.src('test/*.js').pipe(mochaSuiteStream);
    t2.on('error', function (err) {
        if (err) {
            if (err.stack) {
                err = err.stack;
            } else {
                err = String(err);
            }
            process.stderr.write(err);
        }
    });
    return t2;
}
