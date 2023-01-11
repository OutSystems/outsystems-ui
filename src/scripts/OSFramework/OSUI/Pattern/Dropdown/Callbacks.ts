// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Dropdown.Callbacks {
	export type OSOnSelectEvent = {
		(dropdownId: string, selectedOptions: string[]): void;
	};
}
