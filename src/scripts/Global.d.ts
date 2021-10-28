import noUiSlider from 'nouislider';
import noUiSliderOptions from 'nouislider';
import { PipsMode } from 'nouislider';
import OriginalSplide from '@splidejs/splide';
import { Options } from '@splidejs/splide/dist/types/types/options';

/**
 * Set global declarations
 */

declare global {
	//eslint-disable-next-line @typescript-eslint/naming-convention
	interface Window {
		cordova: any;
		noUiSlider: typeof noUiSlider;
		NoUiSliderOptions: typeof noUiSliderOptions;
		NoUiSliderPipsMode: typeof PipsMode;
		Splide: typeof OriginalSplide;
		SplideOpts: typeof OriginalSplide.defaults;
	}

	interface Navigator {
		standalone: any;
	}

	type NoUiSlider = noUiSlider;
	type NoUiSliderOptions = noUiSliderOptions;
	type NoUiSliderPipsMode = PipsMode;
	type Splide = OriginalSplide;
	type SplideOpts = Options;
}
