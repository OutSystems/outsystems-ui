// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.ErrorCodes {
	/**
	 * OutSystemsUI Framework Error Messages
	 */

	export const AbstractChild = {
		ParentNotFound: 'OSUI-GEN-01001',
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
			message: 'This method has no implementation on this Dropdow Type.',
		},
	};

	export const DropdownServerSideItem = {};

	export const Notification = {
		FailRegisterCallback: 'OSUI-GEN-03001',
	};

	export const RangeSlider = {
		FailRegisterCallback: 'OSUI-GEN-04001',
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
}
