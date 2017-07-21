const gulp = require('gulp');
const uglify= require('rollup-plugin-uglify');
const minify = require('uglify-es').minify;
const babel = require('babel-register');
const rollup = require('rollup').rollup;
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const mocha = require('gulp-mocha');

gulp.task('build', function () {
  return rollup({
    entry: 'index.js',
    plugins: [
      nodeResolve({jsnext: true})
      // ,uglify({}, minify)
    ]
  }).then(function (bundle) {
    return bundle.write({
      format: 'iife',
      moduleName: 'tb',
      dest: './dist/tb.min.js'
    });
  }).then(function (bundle) {
    console.log(bundle);
  });
});

gulp.task('test', function () {
  return gulp.src(['test/**/*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      compilers: {
        js: babel
      }
    }));
});
