// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.BottomSheet.Callbacks {
	export type OSOnToggleEvent = {
		(bottomsheetId: string, isOpen: boolean): void;
	};
}
