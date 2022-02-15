// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.ErrorCodes {
	/**
	 * OutSystemsUI Framework Error Messages
	 */

	export const Dropdown = {
		FailOptionItemClicked: 'OSUI-GEN-01001',
		FailOptionItemKeyPressed: 'OSUI-GEN-01002',
		FailRegisterCallback: 'OSUI-GEN-01003',
		FailSetNewOptionItem: 'OSUI-GEN-01004',
		FailToSetOptionItemAction: 'OSUI-GEN-01005',
		FailUnsetNewOptionItem: 'OSUI-GEN-01006',
		HasNoImplementation: {
			code: 'OSUI-GEN-01007',
			message: 'This method has no implementation on this Dropdow Type.',
		},
	};

	export const DropdownServerSideItem = {
		DropdownParentNotFound: 'OSUI-GEN-02001',
	};
}
