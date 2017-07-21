import _gulp from 'gulp';
import gulpHelp from 'gulp-help';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import del from 'del';
import mocha from 'gulp-mocha';

const gulp = gulpHelp(_gulp);

gulp.task('clean', 'remove generated files in lib directory', () => {
  return del([
    'lib/**/*',
  ]);
});

gulp.task('babel', 'generate es5 files in lib directory', () => {
  return gulp.src('src/**/*.js')
    .pipe(babel({ optional: ['runtime'] }))
    .pipe(gulp.dest('lib/'));
});

gulp.task('watch', 'watcher task to generate es5 files', () => {
  gulp.watch('*.js', ['babel']);
});

gulp.task('mocha', 'run the unit tests using mocha', () => {
  return gulp.src(['test/**/*.test.js'])
      .pipe(mocha({
        compilers: {
          js: babel,
        },
      }));
});

gulp.task('lib', 'generate the es5 library in lib', ['clean', 'babel']);

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
