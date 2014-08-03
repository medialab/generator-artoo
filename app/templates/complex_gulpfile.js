var gulp = require('gulp'),
    artoo = require('gulp-artoo'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    webserver = require('gulp-webserver'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

// Linting
gulp.task('lint', function() {
  return gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Build
function preBuild() {
  return gulp.src('./src/*.js')
    .pipe(concat('<%= bookmarkName %>.concat.js'));
}

gulp.task('build', function() {
  return preBuild()
    .pipe(gulp.dest('./build'));
});

// Bookmarklets
gulp.task('bookmark.dev', function() {
  return artoo.blank('<%= bookmarkName %>.bookmark.dev.js')
    .pipe(artoo({
      random: true,
      loadingText: null,
      settings: {
        scriptUrl: 'http<% if (https) { %>s<% } %>://localhost:8000/build/<%= bookmarkName %>.concat.js',
        env: 'dev'
      }
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('bookmark.prod', function() {
  return preBuild()
    .pipe(uglify())
    .pipe(rename('<%= bookmarkName %>.bookmark.prod.js'))
    .pipe(artoo())
    .pipe(gulp.dest('./build'));
});

// Watch
gulp.task('watch', function() {
  gulp.watch('./src', ['build']);
});

// Server
gulp.task('serve', function() {
  gulp.src('./')
    .pipe(webserver({
      directoryListing: true,
      port: 8000<% if (https) { %>,
      https: true<% } %>
    }));
});

// Macro tasks
gulp.task('work', ['build', 'watch', 'serve']);
gulp.task('bookmarklets', ['bookmark.dev', 'bookmark.prod']);
gulp.task('default', ['lint', 'build', 'bookmark.dev', 'bookmark.prod']);
