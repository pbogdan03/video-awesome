import $ from 'jquery';
import semanticui from '../lib/dist/semantic.css';
import stylesheet from './styles.scss';
import videoJs from './components/video/video';
import videoHbs from './components/video/video.hbs';
import videoStyles from './components/video/video.scss';

$('body').prepend(videoHbs);

const hello = 'hello';
console.log(hello + ' index.js loaded..');
console.log(videoHbs);
