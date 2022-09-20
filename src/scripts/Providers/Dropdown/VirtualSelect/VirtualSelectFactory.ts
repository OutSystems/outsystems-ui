/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Dropdown.VirtualSelect.Factory {
	/**
	 * Create the new VirtualSelect instance object according given Mode
	 *
	 * @export
	 * @param {string} dropdownId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.Patterns.Dropdown.IDropdown}
	 */
	export function NewVirtualSelect(
		dropdownId: string,
		mode: string,
		configs: JSON
	): OSFramework.Patterns.Dropdown.IDropdown {
		let _virtualSelectItem = null;

		switch (mode) {
			case OSFramework.Patterns.Dropdown.Enum.Mode.Search:
				_virtualSelectItem = new Providers.Dropdown.VirtualSelect.Search.OSUIVirtualSelectSearch(
					dropdownId,
					configs
				);

				break;

			case OSFramework.Patterns.Dropdown.Enum.Mode.Tags:
				_virtualSelectItem = new Providers.Dropdown.VirtualSelect.Tags.OSUIVirtualSelectTags(
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
