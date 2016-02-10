Video playback prototype
========================

This is a prototype SPA meant to illustrate fullscreen video playback and control cross device. It is targeted at modern mobile
devices: iOS and Android (TODO: document device matrix limitations and callouts).

Setup
-----

```
// set node version
nvm use 5.6.0

// build semantic-ui components
gulp build (in root)

// run the development server (including compilation and live reload)
npm start (http://localhost:3000)

// or generate the production build
npm build // TODO
```

For development make sure to:

- use gitflow (no branch prefix)
- do not commit in development
- install editorconfig

Application flow
----------------

Upon loading the homepage, video playback will automatically start in fullscreen. On certain frames the playback will pause and an overlay will be displayed. The overlay should be transparent and be visually pleasing making use of animations and such. The overlay should include a dismiss button which on click removes the overlay and resumes video playback. Upon completion the user should be
given the option to restart the experience.

Logical architecture
--------------------

TODO

Device matrix
-------------

TODO
