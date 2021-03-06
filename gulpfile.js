var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var babel = require('gulp-babel');

var paths = {
	scripts: ['src/*.js'],
	statics: ['src/*.html', 'src/*.css', 'src/img/*.png', 'src/*.obj', 'src/*.mtl']
};

gulp.task('libs', function() {
	var b = browserify({
		entries: 'libs.js'
	});

	return b.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(concat('libs.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('static', function() {
	return gulp.src(paths.statics)
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['static'], function() {
	var b = browserify({
		entries: 'src/main.js'
	});

	return b.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(concat('game.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('all', ['libs', 'default']);
