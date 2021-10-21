// DatePicker
import flatpickr from 'flatpickr';
import { flatpickrOpts as Options } from 'flatpickr';

// RangeSlider
import noUiSlider from 'nouislider';
import { noUiSliderOpts as Options } from 'nouislider';
import { PipsMode } from 'nouislider';

/**
 * Set global declarations
 */

declare global {
	//eslint-disable-next-line @typescript-eslint/naming-convention
	interface Window {
		cordova: any;
		// DatePicker
		flatpickr: typeof flatpickr;
		flatpickrOptions: typeof flatpickrOpts;

		// RangeSlider
		noUiSlider: typeof noUiSlider;
		NoUiSliderOptions: typeof noUiSliderOpts;
		NoUiSliderPipsMode: typeof PipsMode;
	}

	interface Navigator {
		standalone: any;
	}

	// RangeSlider
	type NoUiSlider = noUiSlider;
	type NoUiSliderOptions = noUiSliderOpts;
	type NoUiSliderPipsMode = PipsMode;

	// DatePicker
	type Flatpickr = flatpickr;
	type FlatpickrOptions = flatpickrOpts;
}
