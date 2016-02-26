import $ from 'jquery';
import PubSub from 'pubsub-js';

import overlayTemplate from './overlay.hbs';

import videoOpts from '../../config';

class Overlay {
    constructor($elem) {
        $elem.append(overlayTemplate({
            overlayFrame: videoOpts.overlayFrame
        }));
        this.$overlay = $('.overlay');
        this.$overlay.hide();

        $('.overlay__close-btn').on('click', function() {
            PubSub.publish('overlay-close', '');
        });
        $('.overlay__submit-btn').on('click', function() {
            PubSub.publish('overlay-close', '');
        });
    }

    show() {
        this.$overlay.show();
    }

    hide() {
        this.$overlay.hide();
    }
}

export default Overlay;
