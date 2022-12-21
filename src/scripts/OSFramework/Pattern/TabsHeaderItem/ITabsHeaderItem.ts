// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.TabsHeaderItem {
	/**
	 * Defines the interface for OutSystemsUI TabsHeaderItem Pattern
	 */
	export interface ITabsHeaderItem extends Interface.IChild {
		get IsActive(): boolean;

		disable(): void;
		enable(): void;
		getDataTab(): number;
		setAriaControlsAttribute(contentItemId: string): void;
		setDataTab(dataTab: number): void;
		setFocus(): void;
		setIsActive(): void;
		unsetIsActive(): void;
		updateOnRender(): void;
	}
}
