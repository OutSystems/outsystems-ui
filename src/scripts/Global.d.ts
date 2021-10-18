import noUiSlider from 'nouislider';
import Options from 'nouislider';
import { PipsMode } from 'nouislider';
import OriginalSplide from '@splidejs/splide';
import { SplideOptions } from '@splidejs/splide';

/**
 * Set global declarations
 */

declare global {
	//eslint-disable-next-line @typescript-eslint/naming-convention
	interface Window {
		cordova: any;
		noUiSlider: typeof noUiSlider;
		NoUiSliderOptions: typeof Options;
		NoUiSliderPipsMode: typeof PipsMode;
		Splide: typeof OriginalSplide;
		SplideOpts: typeof SplideOptions;
	}

	interface Navigator {
		standalone: any;
	}

	type NoUiSlider = noUiSlider;
	type NoUiSliderOptions = Options;
	type NoUiSliderPipsMode = PipsMode;
	type Splide = OriginalSplide;
	type SplideOpts = SplideOptions;
}
