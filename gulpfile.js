var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var babel = require('gulp-babel');

var paths = {
	scripts: ['src/*.js']
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

gulp.task('default', function() {
	return gulp.src(paths.scripts)
		.pipe(concat('game.js'))
		.pipe(babel())
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});
