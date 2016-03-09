import $ from 'jquery';
import PubSub from 'pubsub-js';

import overlayTemplate from './overlay.hbs';

import videoOpts from '../../config';

class Overlay {
    constructor($elem) {
        $elem.append(overlayTemplate({
            overlayFrame: videoOpts.overlayFrame
        }));
        this.$overlay = $elem.find('.overlay');
        this.$overlay.hide();

        $elem.find('.overlay__close-btn').on('click', () => {
            PubSub.publish('overlay-close', '');
        });
        $elem.find('.overlay__submit-btn').on('click', (ev) => {
            ev.preventDefault();
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
