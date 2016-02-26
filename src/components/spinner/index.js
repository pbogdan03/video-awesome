import $ from 'jquery';

import spinnerTemplate from './spinner.hbs';

console.log('Spinner component loaded...');

class Spinner {
    constructor($elem) {
        $elem.append(spinnerTemplate());

        this.$spinner = $('.spinner');
    }

    hide() {
        this.$spinner.hide();
    }
}

export default Spinner;
