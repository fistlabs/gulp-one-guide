'use strict';

var OneGuide = require('one-guide/lib/one-guide');
var PluginError = require('gulp-util').PluginError;

var _ = require('lodash-node');
var adapters = require('one-guide/lib/adapters');
var through = require('through2');

function mkError(message) {
    return new PluginError('one-guide', message);
}

module.exports = function (options) {
    var checkFlow = new OneGuide(_.extend({}, options, {
        adapters: adapters
    }));

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(mkError('Streaming is not supported'));
            return;
        }

        if (!checkFlow.isFilenameExcluded(file.path)) {
            checkFlow.addFileContent(file.contents.toString(), file.path);
        }

        cb(null, file);
    }, function (cb) {
        if (checkFlow.hasCriticalIssues()) {
            cb(mkError(checkFlow.toString()));
            return;
        }
        if (checkFlow.issues.length) {
            process.stderr.write(checkFlow.toString() + '\n\n');
        }
        cb();
    });
};
