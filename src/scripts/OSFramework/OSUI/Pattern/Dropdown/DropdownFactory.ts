/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.OSUI.Patterns.Dropdown.Factory {
	/**
	 * Create the new Dropdown instance object according given provider
	 *
	 * @param dropdownId ID of the Pattern that a new instance will be created.
	 * @param mode
	 * @param provider
	 * @param configs Configurations for the Pattern in JSON format.
	 */
	export function NewDropdown(
		dropdownId: string,
		mode: string,
		provider: string,
		configs: string | Record<string, unknown>
	): Patterns.Dropdown.IDropdown {
		let _dropdownItem = null;

		switch (provider) {
			case Enum.Provider.VirtualSelect:
				_dropdownItem = Providers.OSUI.Dropdown.VirtualSelect.Factory.NewVirtualSelect(
					dropdownId,
					mode,
					OSFramework.OSUI.Helper.ParseConfigs(configs)
				);

				break;

			case Enum.Provider.OSUIComponents:
				if (mode === Enum.Mode.ServerSide) {
					_dropdownItem = new ServerSide.OSUIDropdownServerSide(
						dropdownId,
						OSFramework.OSUI.Helper.ParseConfigs(configs)
					);
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
