// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Sidebar.Callbacks {
	export type OSOnToggleEvent = {
		(sidebarId: string, isOpen: boolean): void;
	};
}
