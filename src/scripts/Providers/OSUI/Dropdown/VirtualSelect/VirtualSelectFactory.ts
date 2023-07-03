/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.OSUI.Dropdown.VirtualSelect.Factory {
	/**
	 * Create the new VirtualSelect instance object according given Mode
	 *
	 * @export
	 * @param {string} dropdownId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.Dropdown.IDropdown}
	 */
	export function NewVirtualSelect(
		dropdownId: string,
		mode: string,
		configs: JSON
	): OSFramework.OSUI.Patterns.Dropdown.IDropdown {
		let _virtualSelectItem = null;

		switch (mode) {
			case OSFramework.OSUI.Patterns.Dropdown.Enum.Mode.Search:
				_virtualSelectItem = new Providers.OSUI.Dropdown.VirtualSelect.Search.OSUIVirtualSelectSearch(
					dropdownId,
					configs
				);

				break;

			case OSFramework.OSUI.Patterns.Dropdown.Enum.Mode.Tags:
				_virtualSelectItem = new Providers.OSUI.Dropdown.VirtualSelect.Tags.OSUIVirtualSelectTags(
					dropdownId,
					configs
				);

				break;

			default:
				throw new Error(`There is no Dropdown of ${mode} mode type`);
		}

		return _virtualSelectItem;
	}
}
