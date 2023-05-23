// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Sidebar.Callbacks {
	export type OSOnToggleEvent = {
		(sidebarId: string, isOpen: boolean): void;
	};
}
