// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.DropdownServerSideItem.Callbacks {
	export type OSOnSelectEvent = {
		(dropdownServerSideItemId: string, itemOptionId: string, dropdownServerSideId?: string): void;
	};
}
