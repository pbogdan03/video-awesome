var gulp = require('gulp');
var argv = require('yargs').argv;
var exec = require('child_process').exec;
var jsonfile = require('jsonfile');

var fwidth = (argv.fwidth === undefined) ? 480: argv.fwidth;
var fheight = (argv.fheight === undefined) ? -1: argv.fheight;
var ffps = (argv.ffps === undefined) ? 25: argv.ffps;
var finput = (argv.input === undefined) ? false: argv.input;
var foutput = (argv.output === undefined) ? false: argv.output;

var mgrid = (argv.mgrid === undefined) ? 10: argv.mgrid;
var mquality = (argv.mquality === undefined) ? 100: argv.mquality;

var configFile = '/src/config.json';
var obj = {};

gulp.task('build-sprites', ['dependencies', 'frames', 'sprites', 'optimize'], function(cb) {
    console.log('--------------- \n sprites done! \n ------------------');
    cb();
});

gulp.task('test-var', function(cb) {
    if(!finput || !foutput) {
        console.log('Warning: Please set video input and/or output path...');
    } else {
        console.log('input and output variables set');
        cb();
    }
});

gulp.task('dependencies', ['ffmpeg', 'imagemagick', 'jpegoptim'], function(cb) {
    console.log('dependencies finished');
    cb();
});

gulp.task('ffmpeg', function(cb) {
    exec('brew install ffmpeg --with-fdk-aac --with-ffplay --with-freetype --with-frei0r --with-libass --with-libvo-aacenc --with-libvorbis --with-libvpx --with-opencore-amr --with-openjpeg --with-opus --with-rtmpdump --with-schroedinger --with-speex --with-theora --with-tools', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('imagemagick', function(cb) {
    exec('brew install imagemagick', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('jpegoptim', function(cb) {
    exec('brew install jpegoptim', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('frames', ['test-var'], function(cb) {
    exec('ffmpeg -i ' + input + ' -vf scale=' + fwidth + ':' + fheight + ' -r ' + ffps + ' "' + foutput + '%d.png"', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    }
});

gulp.task('sprites', ['test-var'], function(cb) {
    exec('montage -monitor -border 0 -geometry ' + fwidth + 'x -tile ' + mgrid + 'x' + mgrid + ' -quality ' + mquality + '% ' + foutput + '*.png "' + foutput + 'video%d.jpg"', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    }
});

gulp.task('optimize', ['test-var'], function(cb) {
    exec('jpegoptim ' + foutput + '*.jpg --dest=optimized/ -m85 --strip-all -p --all-progressive', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    }
});
