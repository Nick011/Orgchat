var gulp = require('gulp');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var nodemon = require('gulp-nodemon');
var exec = require('child_process').exec;

var source = 'frontend/';
var destination = 'public/';

gulp.task('clean', function() {
  return gulp.src([destination + '*'], {read: false}).pipe(clean());
});

gulp.task('css', function() {
  return gulp.src(source + '**/*.css')
    .pipe(minifycss())
    .pipe(gulp.dest(destination));
});

gulp.task('less', function() {
  return gulp.src(source + '**/index.less')
    .pipe(less())
    .pipe(minifycss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(destination));
});

gulp.task('templates', function() {
  return exec('handlebars ' + source + 'templates/handlebars -f ' + source + 'js/templates.js' );
});

gulp.task('javascript', function() {
  var outPath = destination + 'js/';
  exec('r.js -o ' +  source + 'js/build.js');

  return gulp.src(source + 'js/require-2.1.5.min.js')
    .pipe(gulp.dest(outPath));
});

gulp.task('sound', function() {
  return gulp.src(source + 'sound/*.wav')
    .pipe(gulp.dest(destination + 'sound/'));
});

gulp.task('watch', [], function() {
  var watching = false;
  gulp.start('templates', 'less', 'css', 'javascript', 'sound', function() {
    // Protect against this function being called twice. (Bug?)
    if (!watching) {
      watching = true;

      // Watch for changes in frontend js and run the 'javascript' task
      gulp.watch(source + '**/*.js', ['javascript']);

      // Watch for .less file changes and re-run the 'css' task
      gulp.watch(source + '**/*.less', ['less']);

      gulp.watch(source + '**/*.css', ['css']);

      gulp.watch(source + '**/*.handlebars', ['templates']);

      gulp.watch(source + 'sound/*.wav', ['sound']);

      // Start up the server and have it reload when anything in the
      // ./build/ directory changes
      // nodemon({script: 'app.js', watch: 'frontend'});
    }
  });
});

gulp.task('default', [], function() {
  return gulp.start('watch');
});

