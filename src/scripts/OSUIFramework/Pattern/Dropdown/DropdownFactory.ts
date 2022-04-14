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
		mode: string,
		provider: string,
		configs: string
	): OSUIFramework.Patterns.Dropdown.IDropdown {
		let _dropdownItem = null;

		switch (provider) {
			case Enum.Provider.VirtualSelect:
				_dropdownItem = Providers.Dropdown.VirtualSelect.Factory.NewVirtualSelect(
					dropdownId,
					mode,
					JSON.parse(configs)
				);

				break;

			case Enum.Provider.OSUIComponents:
				if (mode === Enum.Mode.ServerSide) {
					_dropdownItem = new ServerSide.OSUIDropdownServerSide(dropdownId, JSON.parse(configs));
				} else {
					throw new Error(`There is no Dropdown of the ${provider} provider with ${mode} type`);
				}

				break;

			default:
				throw new Error(`There is no Dropdown of the ${provider} provider`);
		}

		return _dropdownItem;
	}
}
