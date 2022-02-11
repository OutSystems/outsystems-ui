// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.ErrorCodes {
	/**
	 * OutSystemsUI Framework Error Messages
	 */

	export const Dropdown = {
		FailSetNewOptionItem: 'OSUI-GEN-01001',
		FailUnsetNewOptionItem: 'OSUI-GEN-01002',
		HasNoImplementation: {
			code: 'OSUI-GEN-01003',
			message: 'This method has no implementation on this Dropdow Type.',
		},
	};

	export const DropdownServerSideItem = {
		DropdownParentNotFound: {
			code: 'OSUI-GEN-02001',
		},
	};
}
