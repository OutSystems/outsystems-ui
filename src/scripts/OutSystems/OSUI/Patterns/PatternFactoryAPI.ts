/// <reference path="../../../Providers/OSUI/Carousel/Splide/Splide.ts" />
/// <reference path="../../../Providers/OSUI/Datepicker/Flatpickr/SingleDate/FlatpickrSingleDate.ts" />
/// <reference path="../../../Providers/OSUI/Datepicker/Flatpickr/RangeDate/FlatpickrRangeDate.ts" />
/// <reference path="../../../Providers/OSUI/Dropdown/VirtualSelect/Search/VirtualSelectSearch.ts" />
/// <reference path="../../../Providers/OSUI/Dropdown/VirtualSelect/Tags/VirtualSelectTags.ts" />
/// <reference path="../../../Providers/OSUI/Monthpicker/Flatpickr/FlatpickrMonth.ts" />
/// <reference path="../../../Providers/OSUI/Timepicker/Flatpickr/FlatpickrTime.ts" />
/// <reference path="../../../Providers/OSUI/RangeSlider/NoUISlider/SliderSingle/NoUiSliderSingle.ts" />
/// <reference path="../../../Providers/OSUI/RangeSlider/NoUISlider/SliderInterval/NoUiSliderInterval.ts" />

/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Patterns.PatternFactoryAPI {
	// Object will all internal OutSystems UI Patterns Classes
	const _patternClasses = {
		Accordion: OSFramework.OSUI.Patterns.Accordion.Accordion,
		AccordionItem: OSFramework.OSUI.Patterns.AccordionItem.AccordionItem,
		BottomSheet: OSFramework.OSUI.Patterns.BottomSheet.BottomSheet,
		Carousel: {
			Splide: Providers.OSUI.Carousel.Splide.OSUISplide,
		},
		DatePicker: {
			flatpickr: Providers.OSUI.Datepicker.Flatpickr.SingleDate.OSUIFlatpickrSingleDate,
		},
		DatePickerRange: {
			flatpickr: Providers.OSUI.Datepicker.Flatpickr.RangeDate.OSUIFlatpickrRangeDate,
		},
		DropdownSearch: {
			VirtualSelect: Providers.OSUI.Dropdown.VirtualSelect.Search.OSUIVirtualSelectSearch,
		},
		DropdownTags: {
			VirtualSelect: Providers.OSUI.Dropdown.VirtualSelect.Tags.OSUIVirtualSelectTags,
		},
		DropdownServerSide: {
			OSUIComponents: OSFramework.OSUI.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide,
		},
		DropdownServerSideItem: OSFramework.OSUI.Patterns.DropdownServerSideItem.DropdownServerSideItem,
		FlipContent: OSFramework.OSUI.Patterns.FlipContent.FlipContent,
		Gallery: OSFramework.OSUI.Patterns.Gallery.Gallery,
		MonthPicker: {
			flatpickr: Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth,
		},
		Notification: OSFramework.OSUI.Patterns.Notification.Notification,
		ProgressBar: OSFramework.OSUI.Patterns.Progress.Bar.Bar,
		ProgressCircle: OSFramework.OSUI.Patterns.Progress.Circle.Circle,
		RangeSlider: {
			noUiSlider: Providers.OSUI.RangeSlider.NoUISlider.SingleSlider.OSUINoUiSliderSingle,
		},
		RangeSliderInyterval: {
			noUiSlider: Providers.OSUI.RangeSlider.NoUISlider.IntervalSlider.OSUINoUiSliderInterval,
		},
		Rating: OSFramework.OSUI.Patterns.Rating.Rating,
		SectionIndex: OSFramework.OSUI.Patterns.SectionIndex.SectionIndex,
		SectionIndexItem: OSFramework.OSUI.Patterns.SectionIndexItem.SectionIndexItem,
		Sidebar: OSFramework.OSUI.Patterns.Sidebar.Sidebar,
		Submenu: OSFramework.OSUI.Patterns.Submenu.Submenu,
		SwipeEvents: OSFramework.OSUI.Patterns.SwipeEvents.SwipeEvents,
		Tabs: OSFramework.OSUI.Patterns.Tabs.Tabs,
		TabsContentItem: OSFramework.OSUI.Patterns.TabsContentItem.TabsContentItem,
		TabsHeaderItem: OSFramework.OSUI.Patterns.TabsHeaderItem.TabsHeaderItem,
		TimePicker: {
			flatpickr: Providers.OSUI.TimePicker.Flatpickr.OSUIFlatpickrTime,
		},
		Tooltip: OSFramework.OSUI.Patterns.Tooltip.Tooltip,
		TouchEvents: OSFramework.OSUI.Patterns.TouchEvents.TouchEvents,
	};

	/**
	 * Method to create instance of a OutSystems UI Pattern
	 *
	 * @export
	 * @param {string} patternName
	 * @param {string} patternId
	 * @param {string} configs
	 * @return {*}  {unknown}
	 */
	export function CreateInstance(
		patternName: string,
		patternId: string,
		configs: string,
		provider?: string
	): unknown {
		try {
			let _newClass;
			// create and return Class, based on if its a provider Pattern or not
			if (provider) {
				_newClass = new _patternClasses[patternName][provider](patternId, configs);
			} else {
				_newClass = new _patternClasses[patternName](patternId, configs);
			}

			return _newClass;
		} catch (error) {
			throw new Error(`The Class ${_patternClasses[patternName]} could not be instantiated`);
		}
	}

	/**
	 * Method to overwrite internal Patterns Classes Object, allowing to extend a given Class, by providing a Custom Class instead
	 *
	 * @export
	 * @param {string} patternName
	 * @param {object} patternClass
	 * @return {*}  {void}
	 */
	export function ExtendPatternClass(patternName: string, patternClass: object, provider?: string): void {
		// Check if provider was passed
		const _targetClass = provider ? _patternClasses[patternName][provider] : _patternClasses[patternName];

		// Check if passed Class extends the OoutSystems UI Class
		if (_targetClass.isPrototypeOf(patternClass) === false) {
			console.warn(
				`The Class ${patternClass} must extend the OutSystems UI ${_patternClasses[patternName]} Class`
			);
			return;
		}

		// update internal objetc, based on if its a provider Pattern or not
		if (provider) {
			_patternClasses[patternName][provider] = patternClass;
		} else {
			_patternClasses[patternName] = patternClass;
		}
	}
}
