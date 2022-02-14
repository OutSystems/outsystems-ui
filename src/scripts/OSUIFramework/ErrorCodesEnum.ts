// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.ErrorCodes {
	/**
	 * OutSystemsUI Framework Error Messages
	 */

	export const Dropdown = {
		FailSetNewOptionItem: 'OSUI-GEN-01001',
		FailToSetOptionItemAction: 'OSUI-GEN-01002',
		FailUnsetNewOptionItem: 'OSUI-GEN-01003',
		HasNoImplementation: {
			code: 'OSUI-GEN-01004',
			message: 'This method has no implementation on this Dropdow Type.',
		},
	};

	export const DropdownServerSideItem = {
		DropdownParentNotFound: 'OSUI-GEN-02001',
	};
}
