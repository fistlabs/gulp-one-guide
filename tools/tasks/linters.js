'use strict';

var oneGuidePipe = require('../../gulp-one-guide');
var lintConf = require('../lint-conf');

module.exports = function (gulp) {
    gulp.task('lint', [], function () {
        return this.src(lintConf.patterns).pipe(oneGuidePipe({
            config: 'yandex-node',
            root: process.cwd(),
            excludes: lintConf.excludes
        }));
    });
};
