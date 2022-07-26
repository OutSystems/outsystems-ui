// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.ErrorCodes {
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
		FailRegisterCallback: 'OSUI-GEN-02003',
		FailSetNewOptionItem: 'OSUI-GEN-02004',
		FailToSetOptionItemAction: 'OSUI-GEN-02005',
		FailUnsetNewOptionItem: 'OSUI-GEN-02006',
		HasNoImplementation: {
			code: 'OSUI-GEN-02007',
			message: 'This method has no implementation on this Dropdown Type.',
		},
	};

	export const DropdownServerSide = {
		FailOnSetIntersectionObserver: 'OSUI-GEN-11001',
	};

	export const Notification = {
		FailRegisterCallback: 'OSUI-GEN-03001',
	};

	export const RangeSlider = {
		FailRegisterCallback: 'OSUI-GEN-04001',
		FailSetValue: 'OSUI-GEN-04002',
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
		FailRegisterCallback: 'OSUI-GEN-08001',
		FailOnSetIntersectionObserver: 'OSUI-GEN-08002',
	};

	export const Tabs = {
		FailChildItemClicked: 'OSUI-GEN-09001',
		FailSetNewChildContentItem: 'OSUI-GEN-09002',
		FailSetNewChildHeaderItem: 'OSUI-GEN-09003',
		FailToSetChildItemAction: 'OSUI-GEN-09004',
		FailUnsetNewChildContentItem: 'OSUI-GEN-09005',
		FailUnsetNewChildHeaderItem: 'OSUI-GEN-09006',
	};

	export const AbstractParent = {
		FailChildNotFound: 'OSUI-GEN-10001',
		FailChildsNotFound: 'OSUI-GEN-10002',
		FailTypeNotFound: 'OSUI-GEN-10003',
	};
}
