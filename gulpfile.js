const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();
const pug = require('gulp-pug');

// Sass Task
function scssTask() {
	return src('app/scss/main.scss', { sourcemaps: true })
		.pipe(sass())
		.pipe(postcss([cssnano()]))
		.pipe(dest('dist', { sourcemaps: '.' }));
}

// Browsersync Tasks
function browsersyncServe(cb) {
	browsersync.init({
		server: {
			baseDir: '.',
		},
	});
	cb();
}
function htmltopug() {
	return src('views/*.pug').pipe(pug()).pipe(dest('./'));
}
function browsersyncReload(cb) {
	browsersync.reload();
	cb();
}

// Watch Task
function watchTask() {
	watch('*.html', browsersyncReload);
	watch(
		['app/scss/**/*.scss', 'app/js/**/*.js', 'views/**/*.pug'],
		series(scssTask, htmltopug, browsersyncReload)
	);
}

// Default Gulp task
exports.default = series(scssTask, browsersyncServe, htmltopug, watchTask);
