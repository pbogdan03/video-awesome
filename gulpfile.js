'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var argv = require('yargs').argv;
var childProcess = require('child_process');
var exec = childProcess.exec;
var spawn = childProcess.spawn;
var jsonfile = require('jsonfile');
var fs = require('fs');

let configFile = './src/config.json';
let VIDEO_CONFIG = {};

let fwidth = (argv.fwidth === undefined) ? 480: argv.fwidth;
let fheight = (argv.fheight === undefined) ? -1: argv.fheight;
let ffps = (argv.ffps === undefined) ? 25: argv.ffps;
let finput = (argv.input === undefined) ? false: argv.input;
let foutput = (argv.output === undefined) ? false: argv.output;

let mgrid = (argv.mgrid === undefined) ? 10: argv.mgrid;
let mquality = (argv.mquality === undefined) ? 100: argv.mquality;

gulp.task('build-sprites', ['optimize'], (cb) => {
    console.log('--------------- \n sprites done! \n ------------------');
    cb();
});

gulp.task('test-var', (cb) => {
    // task for storing arguments in config json

    testConfigFile(configFile);

    jsonfile.readFile(configFile, (err, obj) => {
        // if config file empty
        VIDEO_CONFIG = obj || {};

        if(!finput || !foutput) {
            console.log('Warning: Please set video input and/or output path...');
        } else {
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
    var frames = spawn('ffmpeg', ['-i', finput, '-vf', 'scale=' + fwidth + ':' + fheight, '-r', ffps, foutput + '%d.png']);
    frames.stdout.on('data', (data) => {gutil.log(data.toString())});
    frames.stderr.on('data', (data) => {gutil.log(data.toString())});
    frames.on('exit', (code) => {
        if(code != 0) {
            console.log('Failed: ' + code);
        }
        cb();
    });
});

gulp.task('sprites', ['test-var', 'frames'], (cb) => {
    var sprites = spawn('montage', ['-monitor', '-border', '0', '-geometry', fwidth + 'x', '-tile', mgrid + 'x' + mgrid, '-quality', mquality + '%', foutput + '*.png', foutput + 'video%d.jpg']);
    sprites.stdout.on('data', (data) => {gutil.log(data.toString())});
    sprites.stderr.on('data', (data) => {gutil.log(data.toString())});
    sprites.on('exit', (code) => {
        if(code != 0) {
            console.log('Failed: ' + code);
        }
        cb();
    });
});

gulp.task('optimize', ['test-var', 'sprites'], (cb) => {
    var optimize = spawn('jpegoptim', [foutput + '*.jpg', '--dest=optimized/', '-m85', '--strip-all', '-p', '--all-progressive']);
    optimize.stdout.on('data', (data) => {gutil.log(data.toString())});
    optimize.stderr.on('data', (data) => {gutil.log(data.toString())});
    optimize.on('exit', (code) => {
        if(code != 0) {
            console.log('Failed: ' + code);
        }
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
