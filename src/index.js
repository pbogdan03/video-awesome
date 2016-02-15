import $ from 'jquery';
import stylesheet from './styles.scss';
import videoJs from './components/video/video';
import videoHbs from './components/video/video.hbs';
import videoStyles from './components/video/video.scss';

videoJs();

$('body').prepend(videoHbs);

console.log('index.js loaded..');
