// DatePicker => Flatpickr
import flatpickr from 'flatpickr';
import { BaseOptions as flatpickrOpts } from 'flatpickr/dist/types/options';
import { CustomLocale as flatpickrLocale } from 'flatpickr/dist/types/locale';
import { Key as flatpickrLocaleKey } from 'flatpickr/dist/types/locale';

// RangeSlider
import noUiSlider from 'nouislider';
import { Options as noUiSliderOptions } from 'nouislider';
import { Pips } from 'nouislider';
import { Range } from 'nouislider';
import { PartialFormatter } from 'nouislider';

// Carousel
import OriginalSplide from '@splidejs/splide';
import { Options as splideOptions } from '@splidejs/splide/dist/types/index';

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
		NoUiSliderOptions: typeof Options;
		NoUiSliderPips: typeof Pips;
		NoUiSliderRange: typeof Range;
		NoUISliderTooltip: typeof boolean | PartialFormatter | (boolean | PartialFormatter)[];

		// Carousel
		Splide: typeof OriginalSplide;
		SplideOpts: typeof splideOptions;
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

	// MonthYear type for TimePicker
	type MonthYear = {
		Month: string;
		Year: number;
	};

	// Orientation type
	type Orientation = OSFramework.GlobalEnum.Orientation.Vertical | OSFramework.GlobalEnum.Orientation.Horizontal;

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
	type NoUiSliderPips = Pips;
	type NoUiSliderRange = Range;
	type NoUISliderTooltip = typeof boolean | PartialFormatter | (boolean | PartialFormatter)[];
	type wNumb = WNumb;

	// Carousel
	type CarouselProviderConfigs = SplideOpts;
	// Carousel => Splide
	type Splide = OriginalSplide;
	type SplideOpts = splideOptions;

	// DatePicker => Flatpickr
	type DatePickerProviderConfigs = FlatpickrOptions;
	type TimePickerProviderConfigs = FlatpickrOptions;
	type MonthPickerProviderConfigs = FlatpickrOptions;
	type Flatpickr = flatpickr;
	type FlatpickrOptions = flatpickrOpts;
	type FlatpickrLocale = flatpickrLocale;
	type FlatpickrLocaleKey = flatpickrLocaleKey;

	// DropDown => Virtual Select Provider
	type VirtualSelect = any;

	// DropDown => OutSystems Provider
	type OSUIComponents = any;
}
