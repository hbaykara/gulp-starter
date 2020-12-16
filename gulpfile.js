const gulp = require('gulp'),
 browserSync = require('browser-sync').create(),
 sass = require('gulp-sass'),
 minifyCSS = require('gulp-csso'),
 plumber = require("gulp-plumber"),
 babel = require("gulp-babel"),
 minifyImg = require('gulp-imagemin'),
 minifyJS = require('gulp-uglify'),
 concat = require('gulp-concat'),
 autoprefixer = require('gulp-autoprefixer'),
 del = require('del'),
 runSequence = require('run-sequence');

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
});

gulp.task('css', () => {
    return gulp.src('src/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'nested',
            precision: 10,
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(autoprefixer())
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('js', () => {
    return gulp.src('src/js/**/*.js')
        .pipe(plumber())
        .pipe(
            babel({
              presets: ["@babel/preset-env"]
            })
        )
        .pipe(concat('app.min.js'))
        .pipe(minifyJS())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('html', () => {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('img', () => {
    gulp.src('src/img/**/*')
        // .pipe(minifyImg())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('delete', () => del(['dist/css', 'dist/js', 'dist/img', 'dist/**/*.html']));

gulp.task('watch', () => {
    gulp.watch("src/scss/**/*.scss", ['css']);
    gulp.watch("src/js/**/*.js", ['js']);
    gulp.watch("src/img/**/*", ['img']);
    gulp.watch("src/**/*.html", ['html']);
});

gulp.task('default', () => {
    runSequence(
        'delete',
        'html',
        'css',
        'js',
        'img',
        'browser-sync',
        'watch'
    );
});
