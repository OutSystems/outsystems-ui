// DatePicker
import flatpickr from 'flatpickr';
import flatpickrOpts from 'flatpickr';

// RangeSlider
import noUiSlider from 'nouislider';
import noUiSliderOptions from 'nouislider';
import { PipsMode } from 'nouislider';

// Carousel
import OriginalSplide from '@splidejs/splide';
import { Options } from '@splidejs/splide/dist/types/types/options';

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
		NoUiSliderOptions: typeof noUiSliderOptions;
		NoUiSliderPipsMode: typeof PipsMode;

		// Carousel
		Splide: typeof OriginalSplide;
		SplideOpts: typeof OriginalSplide.defaults;
	}

	interface Navigator {
		standalone: any;
	}

	// RangeSlider
	type NoUiSlider = noUiSlider;
	type NoUiSliderOptions = noUiSliderOptions;
	type NoUiSliderPipsMode = PipsMode;

	// Carousel
	type Splide = OriginalSplide;
	type SplideOpts = Options;

	// DatePicker
	type Flatpickr = flatpickr;
	type FlatpickrOptions = flatpickrOpts;
	type FlatPickerAdvancedConfig = {
		DisableDates: [];
		DisableDatesRange: [];
		EnableDates: [];
		EnableDatesRange: [];
		EventDates: [];
	};
}
