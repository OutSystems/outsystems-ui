// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.DropdownServerSideItem.Callbacks {
	export type OSOnSelectEvent = {
		(dropdownId: string, itemId): void;
	};
}
