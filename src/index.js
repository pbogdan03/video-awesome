import $ from 'jquery';
import canvid from 'canvid';
import fontAwesome from 'font-awesome/scss/font-awesome.scss';
import stylesheet from './styles.scss';
import videoJs from './components/video/video';
import videoHbs from './components/video/video.hbs';

console.log(fontAwesome);

videoJs();

$('body').prepend(videoHbs);

var imageSprites = {};
for(var i = 0; i <= 47; i++) {
    if(i < 9) {
        imageSprites['clip0' + i] = {
            src: './assets/frames/optimized/jpegoptim/aliendesert0' + i + '.jpg',
            frames: 100,
            cols: 10,
            fps: 30,
            loops: 1,
            nextClip: 'clip0' + (i + 1),
            onEnd: function() {
                canvidControl.play(this.nextClip);
            }
        };
    } else if(i === 9) {
        imageSprites['clip0' + i] = {
            src: './assets/frames/optimized/jpegoptim/aliendesert0' + i + '.jpg',
            frames: 100,
            cols: 10,
            fps: 30,
            loops: 1,
            nextClip: 'clip' + (i + 1),
            onEnd: function() {
                canvidControl.play(this.nextClip);
            }
        };
    } else if(i === 47) {
        imageSprites['clip' + i] = {
            src: './assets/frames/optimized/jpegoptim/aliendesert' + i + '.jpg',
            frames: 100,
            cols: 10,
            fps: 30,
            loops: 1
        };
    } else {
        imageSprites['clip' + i] = {
            src: './assets/frames/optimized/jpegoptim/aliendesert' + i + '.jpg',
            frames: 100,
            cols: 10,
            fps: 30,
            loops: 1,
            nextClip: 'clip' + (i + 1),
            onEnd: function() {
                canvidControl.play(this.nextClip);
            }
        };
    }
}

//console.log(imageSprites.clip00);

var canvidControl = canvid({
    selector : '.canvas-video',
    videos: 
    imageSprites
    // {
    //     clip00: {
    //         src: './assets/frames/optimized/0239x2.jpg',
    //         frames: 5,
    //         cols: 1,
    //         fps: 30,
    //         loops: 100,
    //         //nextClip: 'clip0' + (i + 1),
    //         // onEnd: function() {
    //         //     canvidControl.play(this.nextClip);
    //         // }
    //     }
    // }
    ,
    loaded: function() {
        $('.spinner').hide();
        $('.video-controls').show();
        canvidControl.play('clip00');
    }
});

var flip = true,
   pause = "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28",
   play = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26";

$(".video-controls__pause").on('click', function() {
    flip = !flip;
    $('#animation').attr({
        "from": flip ? pause : play,
        "to": flip ? play : pause
    }).get(0).beginElement();
    if(canvidControl.isPlaying()) {
        return canvidControl.pause();
    }
    return canvidControl.resume();
});



console.log('index.js loaded..');
