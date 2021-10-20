// DatePicker
import flatpickr from 'flatpickr';
// RangeSlider
import noUiSlider from 'nouislider';
import Options from 'nouislider';
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
		flatpickrOptions: typeof Object;
		// RangeSlider
		noUiSlider: typeof noUiSlider;
		NoUiSliderOptions: typeof Options;
		NoUiSliderPipsMode: typeof PipsMode;
	}

	interface Navigator {
		standalone: any;
	}

	// RangeSlider
	type NoUiSlider = noUiSlider;
	type NoUiSliderOptions = Options;
	type NoUiSliderPipsMode = PipsMode;
	// DatePicker
	type Flatpickr = flatpickr;
	type FlatpickrOptions = {};
}
