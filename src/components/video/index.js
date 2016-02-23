import $ from 'jquery';
import canvid from 'canvid';

//import videoConfig from './videoConfig';
import spinner from 'spinner';
var videoConfig = {
    imageNumber: 47
};
console.log('Video component loaded...');

var imageSources = [],
    images = [],
    videoOpts = {
        selector: '.canvas-video',
        frames: 100,
        cols: 10,
        fps: 30,
        loops: 1,
        width: 800,
        height: 450
    };

for (let i = 0; i <= videoConfig.imageNumber; i++) {
    imageSources.push('./assets/frames/optimized/aliendesert_' + i + '.jpg');
}

class VideoPlayer {
    constructor(options) {
        this.options = options;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        this.canvas.classList.add('canvid');

        document.querySelector(this.options.selector).appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');

        requestAnimationFrame = window.requestAnimationFrame 
                                || window.webkitRequestAnimationFrame 
                                || window.mozRequestAnimationFrame 
                                || window.msRequestAnimationFrame 
                                || function(callback) {
                                    return setTimeout(callback, 1000 / 60);
                                }
    }

    play() {
        this._videoPlayer(0, 47, function() {
            console.log('video finished');
        });
    }

    pause() {
        // TODO
    }

    _videoPlayer(start, finish, cb) {
        cb = cb || function() {};
        if(start > finish) {
            cb();
        }

        if(!this.firstImg) {
            this.firstImg = {};
            this.firstImg = new Image();
            this.firstImg.src = imageSources[start];
            this.firstImg.onload = function() {
                if(isFunction(this.loaded)) {
                    this.loaded();
                }
                this._playVideo(this.firstImg, () => {
                    this._videoPlayer(start + 1, finish);
                });
            }.bind(this);
        } else {
            // play current image
            this._playVideo(this.currImg, () => {
                this._videoPlayer(start + 1, finish);
            });
        }

        // load next image with a 1s delay from video start
        setTimeout(function() {
            this.currImg = {};
            this.currImg = new Image();
            this.currImg.src = imageSources[start + 1];
            this.currImg.onload = function() {
                console.log('image ' + start + ' loaded');
            }
        }.bind(this), 1000);
    }

    _playVideo(img, cb) {
        let frameWidth = img.width / this.options.cols,
            frameHeight = img.height / Math.ceil(this.options.frames / this.options.cols),
            currFps = this.options.fps || 15,
            delay = 60 / currFps;

        let opts = {
            img: img,
            frameWidth: frameWidth,
            frameHeight: frameHeight,
            currFps : currFps,
            currFrame : 0,
            wait : 0,
            playing : true,
            loops : 0,
            delay : delay,
            cb: cb
        };

        requestAnimationFrame(() => {
            this._frame(opts);
        });

    }

    _frame(opts) {
        if (!opts.wait) {
            this._drawFrame(opts);
            opts.currFrame++;
            if (opts.currFrame < 0) opts.currFrame += this.options.frames;
            if (opts.currFrame >= this.options.frames) opts.currFrame = 0;
            if (!opts.currFrame) opts.loops++;
            if (this.options.loops && opts.loops >= this.options.loops){
                opts.playing = false;
                // playback finished
                opts.cb();
            }
        }
        opts.wait = (opts.wait + 1) % opts.delay;
        
        if (opts.playing && this.options.frames > 1) {
            requestAnimationFrame(() => {
                this._frame(opts);
            });
        }
    }

    _drawFrame(opts) {
        let fx = Math.floor(opts.currFrame % this.options.cols) * opts.frameWidth,
            fy = Math.floor(opts.currFrame / this.options.cols) * opts.frameHeight;

        this.ctx.clearRect(0, 0, this.options.width, this.options.height); // clear frame
        this.ctx.drawImage(opts.img, fx, fy, opts.frameWidth, opts.frameHeight, 0, 0, this.options.width, this.options.height);
    }
}

var videoPlayer = new VideoPlayer(videoOpts);
videoPlayer.play();

videoPlayer.loaded = function() {
    console.log('video is playing...');
    $('.spinner').hide(); 
};

var flip = true,
    pause = "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28",
    play = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26";

///////////////////////////////////

function playBtnAnim() {
    flip = !flip;
    $('#animation').attr({
        "from": flip ? pause : play,
        "to": flip ? play : pause
    }).get(0).beginElement();
}

function isFunction(obj) {
    // taken from jQuery
    return typeof obj === 'function' || !!(obj && obj.constructor && obj.call && obj.apply);
}

//export default canvidControl; 
