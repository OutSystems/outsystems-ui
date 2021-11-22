// DatePicker => Flatpickr
import flatpickr from 'flatpickr';
import { BaseOptions as flatpickrOpts } from 'flatpickr/dist/types/options';
import { CustomLocale as flatpickrLocale } from 'flatpickr/dist/types/locale';

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

		// DatePicker => Flatpickr
		flatpickr: typeof flatpickr;
		flatpickrOpts: typeof flatpickrOpts;
		flatpickrLocale: typeof flatpickrOpts;

		// RangeSlider
		noUiSlider: typeof noUiSlider;
		NoUiSliderOptions: typeof noUiSliderOptions;
		NoUiSliderPipsMode: typeof PipsMode;

		// Carousel
		Splide: typeof OriginalSplide;
		SplideOpts: typeof OriginalSplide.defaults;
		wNumb: typeof window.wNumb;
	}

	interface Navigator {
		standalone: any;
	}

	// RangeSlider
	type NoUiSlider = noUiSlider;
	type NoUiSliderOptions = noUiSliderOptions;
	type NoUiSliderPipsMode = PipsMode;
	type wNumb = WNumb;

	// Carousel
	type Splide = OriginalSplide;
	type SplideOpts = Options;

	// DatePicker => Flatpickr
	type Flatpickr = flatpickr;
	type FlatpickrOptions = flatpickrOpts;
	type FlatpickrLocale = flatpickrLocale;
}
