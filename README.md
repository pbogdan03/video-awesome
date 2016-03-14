Video playback prototype
========================

This is a prototype SPA meant to illustrate fullscreen video playback and control cross device. It is targeted at modern mobile devices: iOS and Android (TODO: document device matrix limitations and callouts).

Setup
-----

```
// set node version
nvm use 5.6.0

// install dependencies
npm i && bower install

// run the development server (including compilation and live reload)
npm start (http://localhost:3000)

// or generate the production build
npm build // TODO
```

For development make sure to:

- use gitflow (no branch prefix)
- do not commit in development
- install editorconfig

Create jpeg sprites for video playback
--------------------------------------

Dependencies: Homebrew, ffmpeg, imagemagick, jpegoptim

Install dependencies

```
gulp dependencies
```

Use the installed dependencies to generate the sprite sheets

```
// run this to be safe
sudo launchctl limit maxfiles 100000 100000 && ulimit -n 100000

// generate frames from video
// input and output need to be passed and the rest are optional
// not passing fwidth, fheight and ffps sets them to the default values shown below
gulp frames --input ./dist/assets/myvideo.mp4 --output ./dist/assets/frames/ --fwidth 480 --fheight -1 --ffps 25

// generate sprite sheets from frames
gulp sprites --output ./dist/assets/frames/ --fwidth 480 --mgrid 10 --mquality 100

// optimize sprite sheets
gulp optimize --output ./dist/assets/frames/

// or run everything at once
gulp build-sprites --input ./dist/assets/myvideo.mp4 --output ./dist/assets/frames/ --fwidth 480 --fheight -1 --ffps 25 --mgrid 10 --mquality 100
```

Application flow
----------------

Upon loading the homepage, video playback will automatically start in fullscreen. On certain frames the playback will pause and an overlay will be displayed. The overlay should be transparent and be visually pleasing making use of animations and such. The overlay should include a dismiss button which on click removes the overlay and resumes video playback. Upon completion the user should be given the option to restart the experience.

Logical architecture
--------------------

The web app uses a component scheme where each component is loaded in the main controller. Each component is loaded when needed and the overlay is displayed on the certain frame from the video component. The configuration file should contain all the necessary data about the video:
- number of sprite sheets
- paths for sprite sheets
- number of frames in each sprite sheet
- number of columns in each sprite sheet
- fps
- number of times the video should repeat
- number of frame on which to display the overlay

Device matrix
-------------

TODO
