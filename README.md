gulp-one-guide [![Build Status](https://travis-ci.org/fistlabs/gulp-one-guide.svg)](https://travis-ci.org/fistlabs/gulp-one-guide)
=========

[Gulp](http://gulpjs.com/) plugin for [one-guide](https://www.npmjs.com/package/one-guide)

##Usage:

```js
var oneGuidePipe = require('gulp-one-guide');
gulp.task('lint', function () {
    return this.src([
        'lib/**/*.js'
    ]).pipe(oneGuidePipe({
        config: 'yandex-node',
        root: process.cwd(),
        excludes: lintConf.excludes
    }));
});
```

---------
LICENSE [MIT](LICENSE)
