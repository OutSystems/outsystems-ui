// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Callbacks {
	//This type, enable us to mention a generic function that will be use.
	//Receiving any number of parameters and having as output of an unknown type.
	//This will allow us in the future not use "any" as a type of an function callback.
	export type Generic = { (...args): unknown };

	//This type is used to define callbacks that will be actions in OutSystems code side.
	export type OSGeneric = { (patternId, ...args): void };

	export type OSAccordionItemToggleEvent = {
		(accordionItemId: string, isExpanded: boolean): void;
	};

	export type OSCarouselSlideMovedEvent = {
		(carouselId: string, index: number): void;
	};

	export type OSCarouselOnInitializeEvent = {
		(carouselId: string): void;
	};

	export type OSRangeSliderOnValueChangeEvent = {
		(rangeSliderId: string, startValue: number, endValue: number): void;
	};

	export type OSRangeSliderInitializeEvent = {
		(rangeSliderId: string): void;
	};

	export type OSNotificationToggleEvent = {
		(notificationId: string, isOpen: boolean): void;
	};

	export type OSRatingSelectEvent = {
		(ratingId: string, value: number): void;
	};

	export type OSSearchCollapseEvent = {
		(searchId: string): void;
	};

	export type OSSidebarToggleEvent = {
		(sidebarId: string, isOpen: boolean): void;
	};

	export type OSFlipContentFlipEvent = {
		(flipId: string, isFlipped: boolean): void;
	};
}
