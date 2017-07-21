import _gulp from 'gulp';
import gulpHelp from 'gulp-help';
import gulpBabel from 'gulp-babel';
import rollupBabel from 'rollup-plugin-babel';
import eslint from 'gulp-eslint';
import del from 'del';
import mocha from 'gulp-mocha';
import { rollup } from 'rollup';
import file from 'gulp-file';

const gulp = gulpHelp(_gulp);

const babelOptions = {
  presets: [
    [
      'es2015', {
        'modules': false
      }
    ]
  ],
  babelrc: false,
  exclude: 'node_modules/**'
};

gulp.task('clean', 'remove generated files in lib directory', () => {
	return del(['lib/**/*']);
});

gulp.task('rollup', 'rollup modules for browser usage', () => {
  return rollup({
          entry: 'index.js',
          plugins: [
            rollupBabel(babelOptions)
          ]
        })
        .then(bundle => {
          return bundle.generate({
            format: 'iife',
            moduleName: 'transposeBinary',
          });
        })
        .then(gen => {
          return file('transpose-binary.js', gen.code, {src: true})
            .pipe(gulp.dest('lib/'));
        });
});

gulp.task('babel', 'generate es5 files in lib directory', () => {
  return gulp.src('src/**/*.js')
    .pipe(gulpBabel())
    .pipe(gulp.dest('lib/'));
});

gulp.task('test', 'run the unit tests using mocha', () => {
	return gulp.src(['test/**/*.test.js']).pipe(mocha({
    reporter: 'spec',
		compilers: {
			js: 'js:babel-core/register'
		}
	}));
});

gulp.task('build', 'generate the es5 library in lib', ['clean', 'rollup']);

gulp.task('lint', 'run eslint on all the source files', () => {
	// Be sure to return the stream from the task;
	// Otherwise, the task may end before the stream has finished.
	return gulp.src(['src/**/*.js'])
	// eslint() attaches the lint output to the "eslint" property
	// of the file object so it can be used by other modules.
		.pipe(eslint())
	// eslint.format() outputs the lint results to the console.
	// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format())
	// To have the process exit with an error code (1) on
	// lint error, return the stream and pipe to failAfterError last.
		.pipe(eslint.failAfterError());
});

// Default Task
gulp.task('default', ['help']);
