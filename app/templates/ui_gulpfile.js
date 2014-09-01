var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    artoo = require('gulp-artoo'),
    rename = require('gulp-rename'),
    webserver = require('gulp-webserver'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

// Files to aggregate
var files = [
  './templates/*.tpl',
  './stylesheets/*.css',
  './src/*.js'
];

// Build
function preBuild() {
  return gulp.src(files)
    .pipe(gulpif('*.tpl', artoo.template()))
    .pipe(gulpif('*.css', artoo.stylesheet()))
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
        reExec: false,
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
    .pipe(artoo({
      settings: {
        reExec: false
      }
    }))
    .pipe(gulp.dest('./build'));
});

// Watch
gulp.task('watch', function() {
  gulp.watch(files, ['build']);
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
gulp.task('default', ['build', 'bookmark.dev', 'bookmark.prod']);
