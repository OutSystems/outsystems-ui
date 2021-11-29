/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSUIFramework.Patterns.Dropdown.Factory {
	/**
	 * Create the new Dropdown instance object according given provider
	 *
	 * @export
	 * @param {string} dropdownId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.Progress.IDropdown}
	 */
	export function NewDropdown(
		dropdownId: string,
		configs: string,
		provider: string
	): OSUIFramework.Patterns.Dropdown.IDropdown {
		let _dropdownItem = null;

		switch (provider) {
			case Enum.Provider.VirtualSelect:
				_dropdownItem = new Providers.DropdownSearch.VirtualSelect.OSUIVirtualSelect(
					dropdownId,
					JSON.parse(configs)
				);

				break;

			default:
				throw new Error(`There is no Dropdown of the ${provider} provider`);
				break;
		}

		return _dropdownItem;
	}
}
