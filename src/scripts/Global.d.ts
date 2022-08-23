// DatePicker => Flatpickr
import flatpickr from 'flatpickr';
import { BaseOptions as flatpickrOpts } from 'flatpickr/dist/types/options';
import { CustomLocale as flatpickrLocale } from 'flatpickr/dist/types/locale';
import { Key as flatpickrLocaleKey } from 'flatpickr/dist/types/locale';

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
		flatpickrLocaleKey: typeof flatpickrLocaleKey;

		// RangeSlider
		noUiSlider: typeof noUiSlider;
		NoUiSliderOptions: typeof noUiSliderOptions;
		NoUiSliderPipsMode: typeof PipsMode;

		// Carousel
		Splide: typeof OriginalSplide;
		SplideOpts: typeof OriginalSplide.defaults;
		wNumb: typeof window.wNumb;

		// Dropdown using VirtualSelect
		VirtualSelect: any;

		// Dropdown created from scratch
		OSUIComponents: any;
	}

	interface Navigator {
		connection: any;
		standalone: any;
	}

	// Drag Events Type
	type DragEvents = Event.DragEvent;

	// Swipe Events Type
	type SwipeEvents = Event.SwipeEvent;

	// Offset Type
	type OffsetValues = {
		bottom?: number;
		left?: number;
		right?: number;
		top?: number;
	};

	// Is Out Of Boundaries Type
	type OutOfBoundaries = {
		bottom: boolean;
		left: boolean;
		right: boolean;
		top: boolean;
	};

	// Set the scroll position type
	type ScrollPosition = {
		direction: OSFramework.GlobalEnum.Direction;
		percentageInView: number;
		pixelInView: number;
		scrollableHeight: number;
		value: number;
		viewHeight: number;
	};

	type ProviderInfo = {
		name: string;
		version: string;
		events: ProviderConfigs;
	};

	type ProviderConfigs =
		| RangeSliderProviderConfigs
		| CarouselProviderConfigs
		| DatePickerProviderConfigs
		| VirtualSelect;

	// RangeSlider
	type NoUiSlider = noUiSlider;
	type RangeSliderProviderConfigs = NoUiSlider;
	type NoUiSliderOptions = noUiSliderOptions;
	type NoUiSliderPipsMode = PipsMode;
	type wNumb = WNumb;

	// Carousel
	type CarouselProviderConfigs = SplideOpts;
	// Carousel => Splide
	type Splide = OriginalSplide;
	type SplideOpts = Options;

	// DatePicker => Flatpickr
	type DatePickerProviderConfigs = FlatpickrOptions;
	type Flatpickr = flatpickr;
	type FlatpickrOptions = flatpickrOpts;
	type FlatpickrLocale = flatpickrLocale;
	type FlatpickrLocaleKey = flatpickrLocaleKey;

	// DropDown => Virtual Select Provider
	type VirtualSelect = any;

	// DropDown => OutSystems Provider
	type OSUIComponents = any;
}
