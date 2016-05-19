'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const jpegoptim = require('imagemin-jpegoptim');
const gulpFn = require('gulp-fn');
const argv = require('yargs').argv;
const childProcess = require('child_process');
const exec = childProcess.exec;
const spawn = childProcess.spawn;
const jsonfile = require('jsonfile');
const fs = require('fs');
const sizeOf = require('image-size');

let configFile = './src/config.json';
let VIDEO_CONFIG = {};

let fwidth = (argv.fwidth === undefined) ? 480: argv.fwidth;
let fheight = (argv.fheight === undefined) ? -1: argv.fheight;
let ffps = (argv.ffps === undefined) ? 25: argv.ffps;
let finput = (argv.input === undefined) ? false: argv.input;
let foutput = (argv.output === undefined) ? false: argv.output;

let mgrid = (argv.mgrid === undefined) ? 10: argv.mgrid;
let mquality = (argv.mquality === undefined) ? 100: argv.mquality;

gulp.task('build-sprites', ['frames', 'sprites', 'optimize'], (cb) => {
    console.log('---------------\nsprites done!\n---------------');
    cb();
});

gulp.task('test-var', (cb) => {
    // task for storing arguments in config json

    testConfigFile(configFile);

    jsonfile.readFile(configFile, (err, obj) => {
        // if config file empty
        VIDEO_CONFIG = obj || {};

        if(finput && foutput) {
            VIDEO_CONFIG.input = finput;
            VIDEO_CONFIG.output = foutput;
        }

        if(!VIDEO_CONFIG.input || !VIDEO_CONFIG.output) {
            console.log('Warning: Please set video input and/or output path...');
        } else {
            VIDEO_CONFIG.fps = ffps;
            VIDEO_CONFIG.frames = mgrid * mgrid;
            VIDEO_CONFIG.cols = mgrid;
            VIDEO_CONFIG.width = fwidth;
            VIDEO_CONFIG.height = fheight;
            VIDEO_CONFIG.quality = mquality;
            jsonfile.writeFile(configFile, VIDEO_CONFIG, (err) => {
                console.log(err);
            });
            console.log('input and output variables set');
            cb();
        }
    });
});

gulp.task('dependencies', ['ffmpeg', 'imagemagick', 'jpegoptim'], (cb) => {
    console.log('dependencies finished');
    cb();
});

gulp.task('ffmpeg', (cb) => {
    exec('brew install ffmpeg --with-fdk-aac --with-ffplay --with-freetype --with-frei0r --with-libass --with-libvo-aacenc --with-libvorbis --with-libvpx --with-opencore-amr --with-openjpeg --with-opus --with-rtmpdump --with-schroedinger --with-speex --with-theora --with-tools', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('imagemagick', (cb) => {
    exec('brew install imagemagick', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('jpegoptim', (cb) => {
    exec('brew install jpegoptim', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('frames', ['test-var'], (cb) => {
    spawn('mkdir', ['./dist/' + VIDEO_CONFIG.output + 'frames']);

    var frames = spawn('ffmpeg', ['-i', VIDEO_CONFIG.input, '-vf', 'scale=' + VIDEO_CONFIG.width + ':' + VIDEO_CONFIG.height, '-r', VIDEO_CONFIG.fps, './dist/' + VIDEO_CONFIG.output + 'frames/%04d.png']);
    frames.stdout.on('data', (data) => {gutil.log(data.toString());});
    frames.stderr.on('data', (data) => {gutil.log(data.toString());});
    frames.on('exit', (code) => {
        if(code !== 0) {
            console.log('Failed: ' + code);
        }
        sizeOf(VIDEO_CONFIG.output + '0001.png', (err, dim) => {
            VIDEO_CONFIG.width = dim.width;
            VIDEO_CONFIG.height = dim.height;
            jsonfile.writeFile(configFile, VIDEO_CONFIG, (err) => {
                console.log(err);
                cb();
            });
        });
    });
});

gulp.task('sprites', ['test-var', 'frames'], (cb) => {
    spawn('mkdir', [VIDEO_CONFIG.output + 'sprites']);

    var sprites = spawn('montage', ['-monitor', '-border', '0', '-geometry', VIDEO_CONFIG.width + 'x', '-tile', VIDEO_CONFIG.cols + 'x' + VIDEO_CONFIG.cols, '-quality', VIDEO_CONFIG.quality + '%', VIDEO_CONFIG.output + '*.png', VIDEO_CONFIG.output + 'sprites/video%d.jpg']);
    sprites.stdout.on('data', (data) => {gutil.log(data.toString());});
    sprites.stderr.on('data', (data) => {gutil.log(data.toString());});
    sprites.on('exit', (code) => {
        if(code !== 0) {
            console.log('Failed: ' + code);
        }
        fs.readdir(VIDEO_CONFIG.output + 'sprites/', function(err, files) {
            VIDEO_CONFIG.imageNumber = files.length;
            jsonfile.writeFile(configFile, VIDEO_CONFIG, (err) => {
                console.log(err);
                cb();
            });
        });
    });
});

gulp.task('_optimize-files', () => {
    var counter = 0;

    return gulp.src('./dist/assets/frames/sprites/*.jpg')
        .pipe(jpegoptim({
            progressive: true,
            max: 85
        })())
        .pipe(gulp.dest('./dist/assets/frames/sprites/optimized'))
        .pipe(gulpFn(function(file) {
            console.log('image ' + counter++ + ' done');
        }));
});

gulp.task('optimize', ['test-var', '_optimize-files'], (cb) => {
    VIDEO_CONFIG.imageSources = [];
    for (let i = 0; i < VIDEO_CONFIG.imageNumber; i++) {
        VIDEO_CONFIG.imageSources.push('./assets/frames/sprites/optimized/video' + i + '.jpg');
    }
    jsonfile.writeFile(configFile, VIDEO_CONFIG, (err) => {
        if(err) {
            console.log(err);
        }
        console.log('jsonfile written...');
        cb();
    });
});

function testConfigFile(configFile) {
    try {
        // see if config file exists
        fs.openSync(configFile, 'r');
    } catch(e) {
        // if not create it
        fs.openSync(configFile, 'w');
    } finally {
        return true;
    }
}
