'use strict';

var assert = require('assert');
var gutil = require('gulp-util');

var Stream = require('stream');

describe('gulp-one-guide', function () {
    var obj = require('../gulp-one-guide');
    it('Should ignore NULL files', function (done) {
        var t2 = obj();
        var spy = 0;
        var f = new gutil.File({
            contents: null
        });
        t2.on('error', function () {
            spy += 1;
        });
        t2.on('finish', function () {
            assert.strictEqual(spy, 0);
            done();
        });
        t2.write(f);
        t2.end();
    });
    it('Should not support streaming files', function (done) {
        var t2 = obj();
        var f = new gutil.File({
            contents: new Stream()
        });
        var spy = 0;
        t2.on('error', function (err) {
            assert.ok(err instanceof gutil.PluginError);
            spy += 1;
        });
        t2.on('finish', function () {
            assert.strictEqual(spy, 1);
            done();
        });
        t2.write(f);
        t2.end();
    });
    it('Should not be failed on checker errors', function (done) {
        var t2 = obj();
        var spy = 0;
        var f = new gutil.File({
            path: '/foo/bar',
            contents: new Buffer('INVALID JS<><><>><')
        });
        t2.on('error', function (err) {
            assert.ok(err instanceof gutil.PluginError);
            spy += 1;
        });
        t2.on('finish', function () {
            assert.strictEqual(spy, 1);
            done();
        });
        t2.write(f);
        t2.end();
    });
    it('Should not check excluded files', function (done) {
        var t2 = obj({
            excludes: ['/foo/**']
        });
        var spy = 0;
        var f = new gutil.File({
            path: '/foo/bar',
            contents: new Buffer('INVALID JS<><><>><')
        });
        t2.on('error', function () {
            spy += 1;
        });
        t2.on('finish', function () {
            assert.strictEqual(spy, 0);
            done();
        });
        t2.write(f);
        t2.end();
    });
    it('Should emit error on critical issues', function (done) {
        var t2 = obj();
        var spy = 0;
        var f = new gutil.File({
            path: '/foo/bar',
            contents: new Buffer('function a () {}')
        });
        t2.on('finish', function () {
            assert.strictEqual(spy, 1);
            done();
        });
        t2.on('error', function (err) {
            assert.ok(err instanceof gutil.PluginError);
            spy += 1;
        });
        t2.write(f);
        t2.end();
    });
    it('Should not emit error on warnings', function (done) {
        var t2 = obj();
        var spy = 0;
        var f = new gutil.File({
            path: '/foo/bar',
            contents: new Buffer('"use strict";\n') // invalid quote mark
        });
        var data = [];
        var w = process.stderr.write;
        process.stderr.write = function (s) {
            data[data.length] = s;
            return w.apply(this, arguments);
        };

        t2.on('finish', function () {
            process.stderr.write = w;
            assert.strictEqual(spy, 0);
            data = Buffer.concat(data).toString();
            assert.ok(/\/foo\/bar/.test(data));
            done();
        });
        t2.on('error', function () {
            spy += 1;
        });
        t2.write(f);
        t2.end();
    });
});
