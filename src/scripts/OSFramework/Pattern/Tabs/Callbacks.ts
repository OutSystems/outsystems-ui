// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Tabs.Callbacks {
	export type OSOnChangeEvent = {
		(tabsId: string, ActiveTab: number): void;
	};
}
