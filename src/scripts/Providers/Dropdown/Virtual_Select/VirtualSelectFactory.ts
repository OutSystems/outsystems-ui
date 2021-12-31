/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Dropdown.Virtual_Select.Factory {
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
		mode: string,
		configs: JSON
	): OSUIFramework.Patterns.Dropdown.IDropdown {
		let _virtualSelectItem = null;

		switch (mode) {
			case OSUIFramework.Patterns.Dropdown.Enum.Mode.Search:
				_virtualSelectItem = new Providers.Dropdown.Virtual_Select.Search.OSUIVirtualSelectSearch(
					dropdownId,
					configs
				);

				break;

			case OSUIFramework.Patterns.Dropdown.Enum.Mode.Tags:
				_virtualSelectItem = new Providers.Dropdown.Virtual_Select.Tags.OSUIVirtualSelectTags(
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
