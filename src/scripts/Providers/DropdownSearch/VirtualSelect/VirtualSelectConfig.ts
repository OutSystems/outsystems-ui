/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.DropdownSearch.VirtualSelect {
	export class VirtualSelectConfig extends OSUIFramework.Patterns.Dropdown.AbstractDropdownConfig {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public getProviderConfig(): any {
			// eslint-disable-next-line prefer-const
			let providerOptions = {
				textDirection: OutSystems.OSUI.Utils.GetIsRTL()
					? OSUIFramework.GlobalEnum.Direction.RTL
					: OSUIFramework.GlobalEnum.Direction.LTR,
				multiple: false,
				search: true,
				position: 'auto',
			};

			//Cleaning undefined properties
			Object.keys(providerOptions).forEach(
				(key) => providerOptions[key] === undefined && delete providerOptions[key]
			);

			return providerOptions;
		}
	}
}
