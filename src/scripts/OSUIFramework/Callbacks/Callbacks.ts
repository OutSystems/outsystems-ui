// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Callbacks {
	//This type, enable us to mention a generic function that will be use.
	//Receiving any number of parameters and having as output of an unknown type.
	//This will allow us in the future not use "any" as a type of an function callback.
	export type Generic = { (...args: unknown[]): unknown };

	//This type is used to define callbacks that will be actions in OutSystems code side.
	export type OSGeneric = { (patternId: string, ...args: unknown[]): void };

	// Carousel
	export type OSCarouselSlideMovedEvent = {
		(carouselId: string, index: number): void;
	};

	export type OSCarouselOnInitializeEvent = {
		(carouselId: string): void;
	};

	// Datepicker
	export type OSDatepickerOnChangeEvent = {
		(datepickerId: string, selectedDate: string | string[]): void;
	};

	// Dropdown
	export type OSDropdownOnSelectEvent = {
		(dropdownId: string, selectedOptions: string[]): void;
	};

	// FlipContent
	export type OSFlipContentFlipEvent = {
		(flipId: string, isFlipped: boolean): void;
	};

	// Notifficaction
	export type OSNotificationToggleEvent = {
		(notificationId: string, isOpen: boolean): void;
	};

	// RangeSlider
	export type OSRangeSliderInitializeEvent = {
		(rangeSliderId: string): void;
	};

	export type OSRangeSliderOnValueChangeEvent = {
		(rangeSliderId: string, startValue: number, endValue: number): void;
	};

	// Rating
	export type OSRatingSelectEvent = {
		(ratingId: string, value: number): void;
	};

	// Search
	export type OSSearchCollapseEvent = {
		(searchId: string): void;
	};

	// Sidebar
	export type OSSidebarToggleEvent = {
		(sidebarId: string, isOpen: boolean): void;
	};
}
