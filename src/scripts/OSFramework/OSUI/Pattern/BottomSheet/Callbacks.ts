// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.BottomSheet.Callbacks {
	export type OSOnToggleEvent = {
		(bottomsheetId: string, isOpen: boolean): void;
	};
}
