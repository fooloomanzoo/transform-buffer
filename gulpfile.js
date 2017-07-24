const gulp = require('gulp');
const gulpHelp = require('gulp-help')(gulp);
const uglify= require('rollup-plugin-uglify');
const minify = require('uglify-es').minify;
const del = require('del');
const fs = require('fs');
const rollup = require('rollup').rollup;
const nodeResolve = require('rollup-plugin-node-resolve');
const mocha = require('gulp-mocha');

gulpHelp.task('clean', 'remove generated files in lib and dist directory', () => {
	return del(['lib/**/*', 'dist/**/*']);
});

gulpHelp.task('rollup-node', 'rollup modules for node usage', () => {
  return rollup({
          entry: 'export.js',
          plugins: [
            nodeResolve({jsnext: true})
          ]
        })
        .then(bundle => {
          cache = bundle;
          return bundle.generate({
            format: 'cjs'
          });
        })
        .then(result => {
          return fs.writeFileSync( 'lib/index.js', result.code );
        })
        .catch(err => {
          console.error(err);
        });
});

gulpHelp.task('rollup-browser', 'rollup modules for browser', () => {
  return rollup({
          entry: 'export.browser.js',
          plugins: [
            nodeResolve({jsnext: true}),
            uglify({}, minify)
          ]
        })
        .then(bundle => {
          return bundle.generate({
            format: 'iife',
            moduleName: 'transposeBinary',
          });
        })
        .then(result => {
          return fs.writeFileSync( 'dist/transpose-binary.min.js', result.code );
        })
        .catch(err => {
          console.error(err);
        });
});

gulpHelp.task('mocha', 'run the unit tests using mocha and chai', () => {
	return gulp.src(['test/**/*.test.js'])
              .pipe(
                mocha({
                  reporter: 'spec'
            	   })
               );
});

gulpHelp.task('build', 'generate the es5 library in lib and browser file in dist', ['clean', 'rollup-node', 'rollup-browser']);

gulpHelp.task('test', 'run the unit tests for node', ['clean', 'rollup-node', 'mocha']);

// Default Task
gulpHelp.task('default', ['help']);
