import $ from 'jquery';
import PubSub from 'pubsub-js';

import stylesheet from './styles.scss';

import VideoPlayer from 'video';
import videoOpts from './config';
import Overlay from 'overlay';
import Spinner from 'spinner';

console.log('Main component loaded...');

let videoPlayer = new VideoPlayer($('.canvas-video'), videoOpts);
let overlay = new Overlay($('.container'));
let spinner = new Spinner($('.video-controls'));

videoPlayer.play();

PubSub.subscribe('video-loaded', () => {
    console.log('video is playing...');
    spinner.hide(); 
});

PubSub.subscribe('video-on-frame-' + videoOpts.overlayFrame, () => {
    console.log('overlay shown');
    overlay.show();
    videoPlayer.pause();
    PubSub.subscribe('overlay-close', () => {
        overlay.hide();
        videoPlayer.play();
        PubSub.unsubscribe('overlay-close');
    });
    PubSub.unsubscribe('video-on-frame-' + videoOpts.overlayFrame);
});
