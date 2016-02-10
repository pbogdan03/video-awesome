var gulp = require('gulp-help')(require('gulp'));
var build = require('./lib/tasks/build');

gulp.task('build', 'Builds all files from source', build);
