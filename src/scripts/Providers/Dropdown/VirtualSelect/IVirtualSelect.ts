// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Dropdown.VirtualSelect {
	/**
	 * Defines the interface for VirtualSelect provider based Patterns
	 */
	export interface IVirtualSelect extends OSFramework.Patterns.Dropdown.IDropdown {
		setValue(selectedValues: DropDownOption[]);
		togglePopup(isEnabled: boolean): void;
	}
}
