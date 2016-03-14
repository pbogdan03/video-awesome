var imageSources = [];
var imageNumber = 47;

for (let i = 0; i <= imageNumber; i++) {
    imageSources.push('./assets/frames/sprites/video' + i + '.jpg');
}

export default {
    frames: 100,
    cols: 10,
    fps: 30,
    width: 1024,
    height: 512,
    imageNumber: imageNumber,
    imageSources: imageSources
}
