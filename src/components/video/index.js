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
        if(start > finish) {
            cb();
        }
        var img = {};
        img = new Image();
        img.src = imageSources[start];
        img.onload = function() {
            this._playVideo().then(function() {
                videoPlayer(start + 1, finish);
            });
        };
    }

    _playVideo(imageSprite) {
        var this.options = videothis.options,
            frameWidth = imageSprite.width / this.options.cols,
            frameHeight = imageSprite.height / Math.ceil(this.options.frames / this.options.cols);

        var curFps = this.options.fps || 15,
            curFrame = 0,
            wait = 0,
            playing = true,
            loops = 0,
            delay = 60 / curFps;

        function frame() {
            if (!wait) {
                drawFrame(curFrame);
                curFrame = (curFrame + 1);
                if (curFrame < 0) curFrame += this.options.frames;
                if (curFrame >= this.options.frames) curFrame = 0;
                if (!curFrame) loops++;
                if (this.options.loops && loops >= this.options.loops){
                    playing = false;
                    if(this.options.onEnd && isFunction(this.options.onEnd)){
                        this.options.onEnd();
                    }
                }
            }
            wait = (wait + 1) % delay;
            if (playing && this.options.frames > 1) requestAnimationFrame(frame);
        }

        function drawFrame(f) {
            var fx = Math.floor(f % this.options.cols) * frameWidth,
                fy = Math.floor(f / this.options.cols) * frameHeight;
        
            ctx.clearRect(0, 0, this.options.width, this.options.height); // clear frame
            ctx.drawImage(img, fx, fy, frameWidth, frameHeight, 0, 0, this.options.width, this.options.height);
        }
    }
}

var videoPlayer = new VideoPlayer(videoOpts);
videoPlayer.play();

// console.log(images);

// function canvid(params) {
//     var defaultOptions = {
//             width : 800,
//             height : 450,
//             selector: '.canvid-wrapper'
//         },
//         firstPlay = true,
//         control = {
//             play: function() {
//                 console.log('Cannot play before images are loaded');
//             }
//         },
//         _opts = merge(defaultOptions, params),
//         el = typeof _opts.selector === 'string' ? document.querySelector(_opts.selector) : _opts.selector;
    
//     if (!el) {
//         return console.warn('Error. No element found for selector', _opts.selector);
//     }

//     if (!_opts.videos) {
//         return console.warn('Error. You need to define at least one video object');
//     }

//     if (hasCanvas()) {

//         loadImages(_opts.videos, function(err, images) {
//             if (err) return console.warn('Error while loading video sources.', err);

//             var ctx = initCanvas(),
//                 requestAnimationFrame = reqAnimFrame();

//             control.play = function(key, reverse, fps) {
//                 if (control.pause) control.pause(); // pause current vid

//                 var img = images[key],
//                     opts = _opts.videos[key],
//                     frameWidth = img.width / opts.cols,
//                     frameHeight = img.height / Math.ceil(opts.frames / opts.cols);

//                 var curFps = fps || opts.fps || 15,
//                     curFrame = reverse ? opts.frames - 1 : 0,
//                     wait = 0,
//                     playing = true,
//                     loops = 0,
//                     delay = 60 / curFps;

//                 requestAnimationFrame(frame);

//                 control.resume = function() {
//                     playing = true;
//                     requestAnimationFrame(frame);
//                 };

//                 control.pause = function() {
//                     playing = false;
//                     requestAnimationFrame(frame);
//                 };

//                 control.isPlaying = function() {
//                     return playing;
//                 };

//                 control.destroy = function(){
//                     control.pause();
//                     removeCanvid();
//                 };

//                 control.getCurrentFrame = function(){
//                     return curFrame;
//                 };

//                 control.setCurrentFrame = function(frameNumber){
//                     if(frameNumber < 0 || frameNumber >= opts.frames){
//                         return false;
//                     }

//                     if(!isPlaying){
//                         drawFrame(frameNumber);
//                     }        

//                     curFrame = frameNumber;
//                 };

//                 if (firstPlay) {
//                     firstPlay = false;
//                     hideChildren();
//                 }

//                 function frame() {
//                     if (!wait) {
//                         drawFrame(curFrame);
//                         curFrame = (+curFrame + (reverse ? -1 : 1));
//                         if (curFrame < 0) curFrame += +opts.frames;
//                         if (curFrame >= opts.frames) curFrame = 0;
//                         if (reverse ? curFrame == opts.frames - 1 : !curFrame) loops++;
//                         if (opts.loops && loops >= opts.loops){
//                             playing = false;
//                             if(opts.onEnd && isFunction(opts.onEnd)){
//                                 opts.onEnd();
//                             }
//                         }
//                     }
//                     wait = (wait + 1) % delay;
//                     if (playing && opts.frames > 1) requestAnimationFrame(frame);
//                 }

//                 function drawFrame(f) {
//                     var fx = Math.floor(f % opts.cols) * frameWidth,
//                         fy = Math.floor(f / opts.cols) * frameHeight;
                    
//                     ctx.clearRect(0, 0, _opts.width, _opts.height); // clear frame
//                     ctx.drawImage(img, fx, fy, frameWidth, frameHeight, 0, 0, _opts.width, _opts.height);
//                 }

//             }; // end control.play

//             if (isFunction(_opts.loaded)) {
//                 _opts.loaded(control);
//             }

//         }); // end loadImages

//     } else if (opts.srcGif) {
//         var fallbackImage = new Image();
//         fallbackImage.src = opts.srcGif;

//         el.appendChild(fallbackImage);
//     }

//     function loadImages(imageList, callback) {
//         var images = {},
//             imagesToLoad = Object.keys(imageList).length;
        
//         if(imagesToLoad === 0) {
//             return callback('You need to define at least one video object.'); 
//         }
          
//         for (var key in imageList) {
//             images[key] = new Image();
//             images[key].onload = checkCallback;
//             images[key].onerror = callback;
//             images[key].src = imageList[key].src;
//         }

//         function checkCallback() {
//             imagesToLoad--;
//             if (imagesToLoad === 0) {
//                 callback(null, images);
//             }
//         }
//     }

//     function initCanvas() {
//         var canvas = document.createElement('canvas');
//         canvas.width = _opts.width;
//         canvas.height = _opts.height;
//         canvas.classList.add('canvid');

//         el.appendChild(canvas);

//         return canvas.getContext('2d');
//     }

//     function hideChildren() {
//         [].forEach.call(el.children, function(child){
//             if(!child.classList.contains('canvid') ){
//                 child.style.display = 'none';
//             }
//         });
//     }

//     function removeCanvid(){
//         [].forEach.call(el.children, function(child){
//             if(child.classList.contains('canvid') ){
//                 el.removeChild(child);
//             }
//         });
//     }

//     function reqAnimFrame() {
//         return window.requestAnimationFrame 
//             || window.webkitRequestAnimationFrame 
//             || window.mozRequestAnimationFrame 
//             || window.msRequestAnimationFrame 
//             || function(callback) {
//                 return setTimeout(callback, 1000 / 60);
//             };
//     }

//     function hasCanvas() {
//         // taken from Modernizr
//         var elem = document.createElement('canvas');
//         return !!(elem.getContext && elem.getContext('2d'));
//     }

//     function isFunction(obj) {
//         // taken from jQuery
//         return typeof obj === 'function' || !!(obj && obj.constructor && obj.call && obj.apply);
//     }

//     function merge() {
//         var obj = {}, 
//             key;

//         for (var i = 0; i < arguments.length; i++) {
//             for (key in arguments[i]) {
//                 if (arguments[i].hasOwnProperty(key)) {
//                     obj[key] = arguments[i][key];
//                 }
//             }
//         }
//         return obj;
//     }

//     return control;
// }; // end canvid function

var flip = true,
    pause = "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28",
    play = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26";

// var canvidControl = canvid({
//     selector : '.canvas-video',
//     videos: videoConfig.imageSprites,
//     loaded: function() {
//         $('.spinner').hide();
//         $('.video-controls__play').show();
//         canvidControl.play('clip00');
//     }
// });

// $(".video-controls__play").on('click', function() {
//     playBtnAnim();
//     if(canvidControl.isPlaying()) {
//         return canvidControl.pause();
//     }
//     return canvidControl.resume();
// });

///////////////////////////////////

function playBtnAnim() {
    flip = !flip;
    $('#animation').attr({
        "from": flip ? pause : play,
        "to": flip ? play : pause
    }).get(0).beginElement();
}

//export default canvidControl; 
