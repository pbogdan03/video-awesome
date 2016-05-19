import $ from 'jquery';
import PubSub from 'pubsub-js';
import THREE from 'three';

import videoOpts from '../../config.json';
import spinner from 'spinner';
console.log('Video component loaded...');

class VideoPlayer {
    constructor($elem, options) {
        requestAnimationFrame = window.requestAnimationFrame 
                                || window.webkitRequestAnimationFrame 
                                || window.mozRequestAnimationFrame 
                                || window.msRequestAnimationFrame 
                                || function(callback) {
                                    return setTimeout(callback, 1000 / 60);
                                }
        this.options = options;

        // FOR TESTING ONLY
        if(this.options.height === -1) {
            this.options.height = 256;
        }
        this.options.width = 512;
        // END FOR TESTING ONLY

        this.options.loops = 1;
        this.videoPaused = false;
        this.canvas = document.createElement('canvas');
        this.canvas.width = '512'; //this.options.width;
        this.canvas.height = '256'; //this.options.height === -1 ? '360' : this.options.height; //TODO no fixed value
        //this.canvas.classList.add('canvid');
        this.$pauseBtn = $('.video-controls__pause');

        this.$pauseBtn.on('click',() => {
            playBtnAnim();
            this.videoPaused = !this.videoPaused;
        });

        this.ctx = this.canvas.getContext('2d');

        ///////////
        // THREE //
        ///////////

        this.isUserInteracting = false;
        this.onPointerDownPointerX = 0;
        this.onPointerDownPointerY = 0;
        this.lon = 0;
        this.onPointerDownLon = 0;
        this.lat = 0;
        this.onPointerDownLat = 0;
        this.phi = 0;
        this.theta = 0;
        let deg2rad = Math.PI / 180;

        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
        this.camera.target = new THREE.Vector3( 0, 0, 0 );

        this.scene = new THREE.Scene();

        var geometry = new THREE.SphereGeometry( 500, 60, 40 );
        geometry.scale( - 1, 1, 1 );

        this.texture = new THREE.Texture(this.canvas);

        var material = new THREE.MeshBasicMaterial({map: this.texture, overdraw: true, side:THREE.DoubleSide});

        var mesh = new THREE.Mesh( geometry, material );
        this.scene.add( mesh );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        document.addEventListener( 'mousedown', this._onDocumentMouseDown.bind(this), false );
        document.addEventListener( 'mousemove', this._onDocumentMouseMove.bind(this), false );
        document.addEventListener( 'mouseup', this._onDocumentMouseUp.bind(this), false );

        document.addEventListener( 'touchstart', this._onDocumentTouchStart.bind(this), false );
        document.addEventListener( 'touchmove', this._onDocumentTouchMove.bind(this), false );
        document.addEventListener( 'touchend', this._onDocumentTouchEnd.bind(this), false );

        if (typeof window.DeviceOrientationEvent != "undefined") {
            window.addEventListener("deviceorientation", function(e) {
                this.camera.rotation.set (
                    !e.beta  ? 0 : e.beta * deg2rad,
                    !e.gamma ? 0 : e.gamma * deg2rad,
                    !e.alpha ? 0 : e.alpha * deg2rad
                );
            }.bind(this), false);
        } else {
            alert("Device Orientation not supported");
        }

        $elem.append( this.renderer.domElement ); //this.renderer.domElement
    }

    _onDocumentMouseDown(ev) {
        ev.preventDefault();
        //console.log(this.lon);

        this.isUserInteracting = true;
        this.onPointerDownPointerX = ev.clientX;
        this.onPointerDownPointerY = ev.clientY;

        this.onPointerDownLon = this.lon;
        this.onPointerDownLat = this.lat;
    }

    _onDocumentMouseMove(ev) {
        if ( this.isUserInteracting === true ) {
            //console.log(this.onPointerDownLon);
            this.lon = ( this.onPointerDownPointerX - ev.clientX ) * 0.1 + this.onPointerDownLon;
            this.lat = ( ev.clientY - this.onPointerDownPointerY ) * 0.1 + this.onPointerDownLat;
        }
    }

    _onDocumentMouseUp(ev) {
        this.isUserInteracting = false;
    }

    _onDocumentTouchStart(ev) {
        //ev.preventDefault();

        this.isUserInteracting = true;
        this.onPointerDownPointerX = ev.touches[0].clientX;
        this.onPointerDownPointerY = ev.touches[0].clientY;

        this.onPointerDownLon = this.lon;
        this.onPointerDownLat = this.lat;
    }

    _onDocumentTouchMove(ev) {
        if ( this.isUserInteracting === true ) {
            //console.log(this.onPointerDownLon);
            this.lon = ( this.onPointerDownPointerX - ev.touches[0].clientX ) * 0.1 + this.onPointerDownLon;
            this.lat = ( ev.touches[0].clientY - this.onPointerDownPointerY ) * 0.1 + this.onPointerDownLat;
        }
    }

    _onDocumentTouchEnd(ev) {
        this.isUserInteracting = false;
    }

    _updateWebGL() {
        if ( this.isUserInteracting === false ) {
            this.lon += 0.1;
        }

        this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
        this.phi = THREE.Math.degToRad( 90 - this.lat );
        this.theta = THREE.Math.degToRad( this.lon );

        this.camera.target.x = 500 * Math.sin( this.phi ) * Math.cos( this.theta );
        this.camera.target.y = 500 * Math.cos( this.phi );
        this.camera.target.z = 500 * Math.sin( this.phi ) * Math.sin( this.theta );

        this.camera.lookAt( this.camera.target );
        
        // // distortion
        // this.camera.position.copy( this.camera.target ).negate();
        
        this.texture.needsUpdate = true;
        this.renderer.render( this.scene, this.camera );
    }

    play() {
        if(!this.videoPaused) {
            this._videoPlayer(0, this.options.imageNumber, () => {
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
            var currFrame = opts.currClip * this.options.frames + opts.currFrame;
            if(currFrame === this.options.overlayFrame) {
                this.currFrame = currFrame;
                PubSub.publish('video-on-frame-' + currFrame, '');
            }
            
            // draw on canvas
            this._drawFrame(opts);
            
            opts.currFrame++;
            if(opts.currFrame >= this.options.frames) opts.currFrame = 0;
            if(!opts.currFrame) opts.loops++;
            if(this.options.loops && opts.loops >= this.options.loops) {
                // console.log('clip ' + parseInt(opts.currClip-1) + ' finished');

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
                    // console.log('image ' + opts.currClip + ' loaded');
                }
            }.bind(this), 1000); 
        }

        opts.wait = Math.floor((opts.wait + 1) % opts.delay);
    }

    _drawFrame(opts) {
        let fx = Math.floor(opts.currFrame % this.options.cols) * opts.frameWidth,
            fy = Math.floor(opts.currFrame / this.options.cols) * opts.frameHeight;

        this.ctx.clearRect(0, 0, this.options.width, this.options.height); // clear frame
        this.ctx.drawImage(opts.img, fx, fy, opts.frameWidth, opts.frameHeight, 0, 0, this.options.width, this.options.height);
        console.log('fx', fx);
        console.log('fy', fy);
        console.log('opts.currFrame', opts.currFrame);
        console.log('this.options.cols', this.options.cols);
        console.log('opts.frameWidth', opts.frameWidth);
        console.log('opts.frameHeight', opts.frameHeight);
        console.log('this.options.width', this.options.width);
        console.log('this.options.height', this.options.height);

        this._updateWebGL();
        this.texture.needsUpdate = true;
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
