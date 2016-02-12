import $ from 'jquery';
import stylesheet from './styles.scss';
import videoJs from './components/video/video';
import videoHbs from './components/video/video.hbs';

videoJs();

document.addEventListener('DOMContentLoaded', function(){
    var v = document.querySelectorAll('.video-player')[0];
    var canvas = document.querySelectorAll('.canvas-video')[0];
    var context = canvas.getContext('2d');

    var cw = Math.floor(canvas.clientWidth / 100);
    var ch = Math.floor(canvas.clientHeight / 100);
    canvas.width = cw;
    canvas.height = ch;

    v.addEventListener('play', function(){
        draw(this,context,cw,ch);
    },false);

},false);

function draw(v,c,w,h) {
    if(v.paused || v.ended) return false;
    c.drawImage(v,0,0,w,h);
    setTimeout(draw,20,v,c,w,h);
}

$('body').prepend(videoHbs);

console.log('index.js loaded..');
