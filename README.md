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

```
// install ffmpeg 
brew install ffmpeg --with-fdk-aac --with-ffplay --with-freetype --with-frei0r --with-libass --with-libvo-aacenc --with-libvorbis --with-libvpx --with-opencore-amr --with-openjpeg --with-opus --with-rtmpdump --with-schroedinger --with-speex --with-theora --with-tools

// install imagemagick montage to extract frames
brew install imagemagick

// install jpeg compressor
brew install jpegoptim

// create frames from video
ffmpeg -i ./dist/assets/myvideo.mp4 -vf scale=720:-1 -r 25 "./dist/assets/frames/%04d.png"

// create jpg sprite
montage -monitor -border 0 -geometry 720x -tile 10x10 -quality 100% ./dist/assets/frames/*.png "/dist/assets/frames/myvideo%02d.jpg"

// according to the number of .png's, set the maximum limit of open files in OSX
sudo launchctl limit maxfiles 1000000 1000000

// optimize images 
jpegoptim *.jpg --dest=optimized/ -m85 --strip-all -p
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
