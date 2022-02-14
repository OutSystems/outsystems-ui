// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.ErrorCodes {
	/**
	 * OutSystemsUI Framework Error Messages
	 */

	export const Dropdown = {
		FailOptionItemClicked: 'OSUI-GEN-01001',
		FailOptionItemKeyPressed: 'OSUI-GEN-01002',
		FailSetNewOptionItem: 'OSUI-GEN-01003',
		FailToSetOptionItemAction: 'OSUI-GEN-01004',
		FailUnsetNewOptionItem: 'OSUI-GEN-01005',
		HasNoImplementation: {
			code: 'OSUI-GEN-01006',
			message: 'This method has no implementation on this Dropdow Type.',
		},
	};

	export const DropdownServerSideItem = {
		DropdownParentNotFound: 'OSUI-GEN-02001',
	};
}
