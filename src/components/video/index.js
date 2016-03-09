import $ from 'jquery';
import PubSub from 'pubsub-js';

import videoOpts from '../../config';
import spinner from 'spinner';
console.log('Video component loaded...');

class VideoPlayer {
    constructor($elem, options) {
        this.options = options;
        this.videoPaused = false;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        this.canvas.classList.add('canvid');
        this.$pauseBtn = $('.video-controls__pause');
        console.log(this.$pauseBtn);

        this.$pauseBtn.on('click',() => {
            playBtnAnim();
            this.videoPaused = !this.videoPaused;
        });

        $elem.append(this.canvas);

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
        if(!this.videoPaused) {
            this._videoPlayer(0, videoOpts.imageNumber, () => {
                console.log('video finished');
            });
        } else {
            this.videoPaused = false;
        };
    }

    pause() {
        this.videoPaused = true;
    }

    _videoPlayer(start, finish, cb) {
        cb = cb || function() {};
        if(start > finish) {
            cb();
        }

        let currFps = this.options.fps || 15,
            delay = 60 / currFps;

        let opts = {
            currFps : currFps,
            currFrame : 0,
            wait : 0,
            loops : 0,
            delay : delay,
            currClip : start,
            finishClip : finish,
            nextClipLoaded : false
        };

        this.firstImg = {};
        this.firstImg = new Image();
        this.firstImg.src = this.options.imageSources[opts.currClip];
        this.firstImg.onload = function() {
            this.$pauseBtn.show();
            console.log('image ' + opts.currClip + ' loaded');
            let frameWidth = this.firstImg.width / this.options.cols,
                frameHeight = this.firstImg.height / Math.ceil(this.options.frames / this.options.cols);

            opts.frameWidth = frameWidth;
            opts.frameHeight = frameHeight;    
            opts.img = this.firstImg;

            PubSub.publish('video-loaded', '');

            requestAnimationFrame(() => {
                this._frame(opts, () => {
                    console.log('video finished');
                });
            });
        }.bind(this);
    }

    _frame(opts, cb) {
        cb = cb || function() {};

        if(!opts.wait && !this.videoPaused) {
            // trigger overlay
            var currFrame = opts.currClip * 100 + opts.currFrame;
            if(currFrame === videoOpts.overlayFrame) {
                this.currFrame = currFrame;
                PubSub.publish('video-on-frame-' + currFrame, '');
            }
            
            // draw on canvas
            this._drawFrame(opts);
            
            opts.currFrame++;
            if(opts.currFrame >= this.options.frames) opts.currFrame = 0;
            if(!opts.currFrame) opts.loops++;
            if(this.options.loops && opts.loops >= this.options.loops) {
                //console.log('clip ' + parseInt(opts.currClip-1) + ' finished');

                if(opts.currClip >= opts.finishClip) {
                    console.log('video finished');
                } else {
                    opts.nextClipLoaded = false;
                    opts.currClip++;
                    opts.img = this.nextImg;
                    opts.loops = 0;
                    opts.currFrame = 0;
                    requestAnimationFrame(() => {
                        this._frame(opts);
                    });
                }
            } else {
                requestAnimationFrame(() => {
                    this._frame(opts);
                });
            }            
        } else {
            requestAnimationFrame(() => {
                this._frame(opts);
            });
        }

        if(!opts.nextClipLoaded) {
            opts.nextClipLoaded = true;
            setTimeout(function() {
                this.nextImg = new Image();
                this.nextImg.src = this.options.imageSources[opts.currClip + 1];
                this.nextImg.onload = function() {
                    //console.log('image ' + opts.currClip + ' loaded');
                }
            }.bind(this), 1000); 
        }

        opts.wait = (opts.wait + 1) % opts.delay;
    }

    _drawFrame(opts) {
        let fx = Math.floor(opts.currFrame % this.options.cols) * opts.frameWidth,
            fy = Math.floor(opts.currFrame / this.options.cols) * opts.frameHeight;

        this.ctx.clearRect(0, 0, this.options.width, this.options.height); // clear frame
        this.ctx.drawImage(opts.img, fx, fy, opts.frameWidth, opts.frameHeight, 0, 0, this.options.width, this.options.height);
    }
}

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

export default VideoPlayer; 
