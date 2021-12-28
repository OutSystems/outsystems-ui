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

		// DropdownSearch
		VirtualSelect: any;
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
	type FlatpickrLocaleKey = flatpickrLocaleKey;

	// DropDown => Option type
	type DropDownOption = [
		{
			image_url_or_class: typeof image_url_or_class;
			label: typeof label;
			value: typeof value;
		}
	];

	// DropDown => Virtual Select Provider
	type VirtualSelect = any;
	type VirtualSelectOptionInfo = {
		alias: typeof alias;
		index: typeof index;
		isGroupTitle: typeof isGroupTitle;
		isNew: typeof isNew;
		isSelected: typeof isSelected;
		isVisible: typeof isVisible;
		label: typeof label;
		value: typeof value;
		visibleIndex: typeof visibleIndex;
	};
	type VirtualSelectMethods = {
		addOption: typeof addOption;
		close: typeof close;
		destroy: typeof destroy;
		getDisplayValue: typeof getDisplayValue;
		getNewValue: typeof getNewValue;
		getSelectedOptions: typeof getSelectedOptions;
		hide: typeof hide;
		isAllSelected: typeof isAllSelected;
		open: typeof open;
		reset: typeof reset;
		setDisabledOptions: typeof setDisabledOptions;
		setOptions: typeof setOptions;
		setValue: typeof setValue;
		show: typeof show;
		toggleSelectAll: typeof toggleSelectAll;
	};
	type VirtualSelectOpts = {
		additionalClasses: typeof additionalClasses;
		aliasKey: typeof aliasKey;
		allOptionsSelectedText: typeof allOptionsSelectedText;
		allowNewOption: typeof allowNewOption;
		alwaysShowSelectedOptionsCount: typeof alwaysShowSelectedOptionsCount;
		autofocus: typeof autofocus;
		autoSelectFirstOption: typeof autoSelectFirstOption;
		clearButtonText: typeof clearButtonText;
		descriptionKey: typeof descriptionKey;
		disableAllOptionsSelectedText: typeof disableAllOptionsSelectedText;
		disabled: typeof disabled;
		disabledOptions: typeof disabledOptions;
		disableOptionGroupCheckbox: typeof disableOptionGroupCheckbox;
		disableSelectAll: typeof disableSelectAll;
		dropboxWidth: typeof dropboxWidth;
		dropboxWrapper: typeof dropboxWrapper;
		ele: typeof ele;
		enableSecureText: typeof enableSecureText;
		hasOptionDescription: typeof hasOptionDescription;
		hideClearButton: typeof hideClearButton;
		hideValueTooltipOnSelectAll: typeof hideValueTooltipOnSelectAll;
		keepAlwaysOpen: typeof keepAlwaysOpen;
		labelKey: typeof labelKey;
		labelRenderer: typeof labelRenderer;
		markSearchResults: typeof markSearchResults;
		maxValues: typeof maxValues;
		moreText: typeof moreText;
		multiple: typeof multiple;
		name: typeof name;
		noOfDisplayValues: typeof noOfDisplayValues;
		noOptionsText: typeof noOptionsText;
		noSearchResultsText: typeof noSearchResultsText;
		onServerSearch: typeof onServerSearch;
		optionHeight: typeof optionHeight;
		options: typeof options;
		optionsCount: typeof optionsCount;
		optionSelectedText: typeof optionSelectedText;
		optionsSelectedText: typeof optionsSelectedText;
		placeholder: typeof placeholder;
		popupDropboxBreakpoint: typeof popupDropboxBreakpoint;
		position: typeof position;
		search: typeof search;
		searchPlaceholderText: typeof searchPlaceholderText;
		selectAllOnlyVisible: typeof selectAllOnlyVisible;
		selectAllText: typeof selectAllText;
		selectedValue: typeof selectedValue;
		setValueAsArray: typeof setValueAsArray;
		showDropboxAsPopup: typeof showDropboxAsPopup;
		showOptionsOnlyOnSearch: typeof showOptionsOnlyOnSearch;
		showSelectedOptionsFirst: typeof showSelectedOptionsFirst;
		showValueAsTags: typeof showValueAsTags;
		silentInitialValueSet: typeof silentInitialValueSet;
		textDirection: typeof textDirection;
		tooltipAlignment: typeof tooltipAlignment;
		tooltipFontSize: typeof tooltipFontSize;
		tooltipMaxWidth: typeof tooltipMaxWidth;
		valueKey: typeof valueKey;
		zIndex: typeof zIndex;
	};
}
