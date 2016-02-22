import $ from 'jquery';
import canvid from 'canvid';

import videoConfig from './videoConfig';
import spinner from 'spinner';

console.log('Video component loaded...');

var flip = true,
    pause = "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28",
    play = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26";

var canvidControl = canvid({
    selector : '.canvas-video',
    videos: videoConfig.imageSprites,
    loaded: function() {
        $('.spinner').hide();
        $('.video-controls__play').show();
        canvidControl.play('clip00');
    }
});

$(".video-controls__play").on('click', function() {
    playBtnAnim();
    if(canvidControl.isPlaying()) {
        return canvidControl.pause();
    }
    return canvidControl.resume();
});

///////////////////////////////////

function playBtnAnim() {
    flip = !flip;
    $('#animation').attr({
        "from": flip ? pause : play,
        "to": flip ? play : pause
    }).get(0).beginElement();
}

export default canvidControl; 
