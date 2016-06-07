//gulpfile.js
var gulp = require('gulp');
var concat = require('gulp-concat');
var inject = require('gulp-inject-string');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gutil = require('gulp-util');

gulp.task('vendor', function() {
    return gulp.src([
        './static/js/vendor/jquery-ui.min.js',
        './static/js/vendor/angular.js',
        './static/js/vendor/angular-route.js',
        './static/js/vendor/angular-animate.js',
        './static/js/vendor/angular-resource.js',
        './static/js/vendor/highcharts.js'
    ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./static/js/dist'));

});

gulp.task('ddms', function() {
    return gulp.src([
            './static/js/ddms.module.js',
            './static/js/ddms.config.js',
            './static/js/**/*.module.js',
            './static/js/**/*.controller.js',
            './static/js/**/*.service.js',
            './static/js/**/*.directive.js',
            './static/js/**/*.factory.js',
            './static/js/**/*.filter.js'])
        .pipe(concat('ddms.js'))
        .pipe(gulp.dest('./static/js/dist'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('./static/js/dist'))
});

gulp.task('watch', function() {
    gulp.watch('./static/js/ddms.module.js', ['ddms']);
    gulp.watch('./static/js/ddms.config.js', ['ddms']);
    gulp.watch('./static/js/**/*.module.js', ['ddms']);
    gulp.watch('./static/js/**/*.controller.js', ['ddms']);
    gulp.watch('./static/js/**/*.service.js', ['ddms']);
    gulp.watch('./static/js/**/*.directive.js', ['ddms']);
    gulp.watch('./static/js/**/*.factory.js', ['ddms']);
    gulp.watch('./static/js/**/*.filter.js', ['ddms']);
});

// Default Task
gulp.task('default', ['ddms']);
