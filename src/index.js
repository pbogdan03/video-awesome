import $ from 'jquery';
import canvid from 'canvid';
import stylesheet from './styles.scss';
import videoJs from './components/video/video';
import videoHbs from './components/video/video.hbs';

videoJs();

$('body').prepend(videoHbs);

var imageSprites = {};
for(var i = 0; i <= 9; i++) {
    if(i < 9) {
        imageSprites['clip0' + i] = {
            src: './assets/frames/bigbuckbunny0' + i + '.jpg',
            frames: 36,
            cols: 6,
            loops: 1,
            nextClip: 'clip0' + (i + 1),
            onEnd: function() {
                canvidControl.play(this.nextClip);
            }
        };
    } else if(i === 9) {
        imageSprites['clip0' + i] = {
            src: './assets/frames/bigbuckbunny0' + i + '.jpg',
            frames: 36,
            cols: 6,
            loops: 1,
            nextClip: 'clip' + (i + 1),
            // onEnd: function() {
            //     canvidControl.play(this.nextClip);
            // }
        };
    } else if(i === 82) {
        imageSprites['clip' + i] = {
            src: './assets/frames/bigbuckbunny' + i + '.jpg',
            frames: 36,
            cols: 6,
            loops: 1
        };
    } else {
        imageSprites['clip' + i] = {
            src: './assets/frames/bigbuckbunny' + i + '.jpg',
            frames: 36,
            cols: 6,
            loops: 1,
            nextClip: 'clip' + (i + 1),
            onEnd: function() {
                canvidControl.play(this.nextClip);
            }
        };
    }
}

var canvidControl = canvid({
    selector : '.canvas-video',
    videos: imageSprites,
    loaded: function() {
        $('.spinner').hide();
        canvidControl.play('clip00');
    }
});

console.log('index.js loaded..');
