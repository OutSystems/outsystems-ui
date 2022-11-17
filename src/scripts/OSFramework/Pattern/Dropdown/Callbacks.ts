// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Dropdown.Callbacks {
	export type OSOnSelectEvent = {
		(dropdownId: string, selectedOptions: string[]): void;
	};
}
