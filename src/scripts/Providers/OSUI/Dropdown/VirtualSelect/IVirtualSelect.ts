// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Dropdown.VirtualSelect {
	/**
	 * Defines the interface for VirtualSelect provider based Patterns
	 */
	export interface IVirtualSelect extends OSFramework.OSUI.Patterns.Dropdown.IDropdown {
		setValue(selectedValues: DropDownOption[]): void;
		togglePopup(isEnabled: boolean): void;
	}
}
