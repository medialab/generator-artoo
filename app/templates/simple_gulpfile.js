var gulp = require('gulp'),
    artoo = require('gulp-artoo'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    webserver = require('gulp-webserver'),
    uglify = require('gulp-uglify');

// Linting
gulp.task('lint', function() {
  return gulp.src('./<%= bookmarkName %>.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Bookmarklets
gulp.task('bookmark.dev', function() {
  return artoo.blank('<%= bookmarkName %>.bookmark.dev.js')
    .pipe(artoo({
      random: true,
      loadingText: null,
      settings: {
        scriptUrl: 'http<% if (https) { %>s<% } %>://localhost:8000/<%= bookmarkName %>.js',
        env: 'dev'
      }
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('bookmark.prod', function() {
  return gulp.src('./<%= bookmarkName %>.js')
    .pipe(uglify())
    .pipe(rename('<%= bookmarkName %>.bookmark.prod.js'))
    .pipe(artoo())
    .pipe(gulp.dest('./build'));
});

// Server
gulp.task('serve', function() {
  gulp.src('./')
    .pipe(webserver({
      port: 8000<% if (https) { %>,
      https: true<% } %>
    }));
});

// Macro tasks
gulp.task('work', ['serve']);
gulp.task('default', ['lint', 'bookmark.dev', 'bookmark.prod']);
