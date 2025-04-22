// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.ErrorCodes {
	/**
	 * OutSystemsUI Framework Error Messages
	 */

	export const AbstractChild = {
		FailParentNotFound: 'OSUI-GEN-01001',
	};

	export const Accordion = {
		FailChildItemClicked: 'OSUI-GEN-07001',
		FailSetNewChildItem: 'OSUI-GEN-07002',
		FailToSetChildItemAction: 'OSUI-GEN-07003',
		FailUnsetNewChildItem: 'OSUI-GEN-07004',
	};

	export const Dropdown = {
		FailOptionItemClicked: 'OSUI-GEN-02001',
		FailOptionItemKeyPressed: 'OSUI-GEN-02002',
		FailSetNewOptionItem: 'OSUI-GEN-02003',
		FailToSetOptionItemAction: 'OSUI-GEN-02004',
		FailUnsetNewOptionItem: 'OSUI-GEN-02005',
		HasNoImplementation: {
			code: 'OSUI-GEN-02006',
			message: 'This method has no implementation on this Dropdown Type.',
		},
	};

	export const DropdownServerSide = {
		FailOnSetIntersectionObserver: 'OSUI-GEN-0401',
	};

	export const RangeSlider = {
		FailSetValue: 'OSUI-GEN-04001',
	};

	export const SectionIndex = {
		FailChildItemClicked: 'OSUI-GEN-05001',
		FailSetNewChildItem: 'OSUI-GEN-05002',
		FailToSetChildItemAction: 'OSUI-GEN-05003',
		FailUnsetNewChildItem: 'OSUI-GEN-05004',
	};

	export const SectionIndexItem = {
		FailToSetTargetElement: 'OSUI-GEN-06001',
	};

	export const Tooltip = {
		FailOnSetIntersectionObserver: 'OSUI-GEN-08001',
	};

	export const Tabs = {
		FailChildItemClicked: 'OSUI-GEN-09001',
		FailSetNewChildContentItem: 'OSUI-GEN-09002',
		FailSetNewChildHeaderItem: 'OSUI-GEN-09003',
		FailToSetChildItemAction: 'OSUI-GEN-09004',
		FailUnsetNewChildContentItem: 'OSUI-GEN-09005',
		FailUnsetNewChildHeaderItem: 'OSUI-GEN-09006',
		FailNoContentOrHeaderItemFound: 'OSUI-GEN-09007',
	};

	export const AbstractParent = {
		FailChildNotFound: 'OSUI-GEN-10001',
		FailChildsNotFound: 'OSUI-GEN-10002',
		FailTypeNotFound: 'OSUI-GEN-10003',
	};

	export const AbstractProviderPattern = {
		FailProviderEventHandler: 'OSUI-GEN-11001',
		FailProviderEventRemoval: {
			code: 'OSUI-GEN-11002',
			message: 'The event with this eventId does not exist',
		},
		FailProviderEventSet: {
			code: 'OSUI-GEN-11003',
			message: 'The provided eventName does not exist or is not supported by the provider',
		},
	};

	export const ProviderEventsManager = {
		FailPendingEventRemoval: 'OSUI-GEN-12001',
		FailSavingPendingEvent: 'OSUI-GEN-12002',
		FailSavedEventRemoval: 'OSUI-GEN-12003',
		FailSavingEvent: 'OSUI-GEN-12004',
	};
}
