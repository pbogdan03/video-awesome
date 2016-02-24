import $ from 'jquery';

import stylesheet from './styles.scss';

import VideoPlayer from 'video';

console.log('Main component loaded...');

let videoOpts = {
    selector: '.canvas-video',
    frames: 100,
    cols: 10,
    fps: 30,
    loops: 1,
    width: 800,
    height: 450
};
let videoPlayer = new VideoPlayer(videoOpts);

videoPlayer.play();
videoPlayer.loaded = function() {
    console.log('video is playing...');
    $('.spinner').hide(); 
};
videoPlayer.onFrameX = function() {
    
};
