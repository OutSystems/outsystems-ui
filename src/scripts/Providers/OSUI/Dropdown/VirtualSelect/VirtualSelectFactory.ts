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
		configs: string
	): OSFramework.OSUI.Patterns.Dropdown.IDropdown {
		let _virtualSelectItem = null;
		let _patternName: string;

		switch (mode) {
			case OSFramework.OSUI.Patterns.Dropdown.Enum.Mode.Search:
				_patternName = OSFramework.OSUI.GlobalEnum.PatternName.DropdownSearch;

				break;

			case OSFramework.OSUI.Patterns.Dropdown.Enum.Mode.Tags:
				_patternName = OSFramework.OSUI.GlobalEnum.PatternName.DropdownTags;
				break;

			default:
				throw new Error(`There is no Dropdown of ${mode} mode type`);
		}

		_virtualSelectItem = OutSystems.OSUI.Patterns.PatternFactoryAPI.CreateInstance(
			_patternName,
			dropdownId,
			JSON.parse(configs),
			OSFramework.OSUI.Patterns.Dropdown.Enum.Provider.VirtualSelect
		) as OSFramework.OSUI.Patterns.Dropdown.IDropdown;

		return _virtualSelectItem;
	}
}
