// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.CallbacksOLD {
	// Notificaction
	export type OSBottomSheetOnToggleEvent = {
		(bottomsheetId: string, isOpen: boolean): void;
	};

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

	// DropdownServerSideItem
	export type OSDropdownServerSideItemOnSelectEvent = {
		(dropdownId: string, itemId): void;
	};

	// FlipContent
	export type OSFlipContentFlipEvent = {
		(flipId: string, isFlipped: boolean): void;
	};

	// Notificaction
	export type OSNotificationToggleEvent = {
		(notificationId: string, isOpen: boolean): void;
	};
	export type OSNotificationInitializedEvent = {
		(notificationId: string): void;
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

	// Tabs
	export type OSTabsOnChangeEvent = {
		(tabsId: string, ActiveTab: number): void;
	};
}
