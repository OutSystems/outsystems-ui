/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Dropdown.VirtualSelect.Factory {
	/**
	 * Create the new Flatpickr instance object according given Mode
	 *
	 * @export
	 * @param {string} dropdownId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.Progress.IDatePicker}
	 */
	export function NewVirtualSelect(
		dropdownId: string,
		configs: JSON,
		mode: string
	): OSUIFramework.Patterns.Dropdown.IDropdown {
		let _virtualSelectItem = null;

		switch (mode) {
			case OSUIFramework.Patterns.Dropdown.Enum.Mode.Search:
				_virtualSelectItem = new Providers.Dropdown.VirtualSelect.Search.OSUIVirtualSelectSearch(
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
