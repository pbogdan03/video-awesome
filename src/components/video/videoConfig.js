import video from 'video';

var imageSprites = {};
for(let i = 0; i <= 47; i++) {
    if(i === 47) {
        imageSprites['clip' + i] = {
            src: './assets/frames/optimized/aliendesert_' + i + '.jpg',
            frames: 100,
            cols: 10,
            fps: 30,
            loops: 1
        }
    } else {
        imageSprites['clip' + i] = {
            src: './assets/frames/optimized/aliendesert_' + i + '.jpg',
            frames: 100,
            cols: 10,
            fps: 30,
            loops: 1,
            nextClip: 'clip' + (i + 1),
            onEnd: function() {
                video.play(this.nextClip);
            }
        }
    }
};

export default {
    imageSprites: imageSprites
}
