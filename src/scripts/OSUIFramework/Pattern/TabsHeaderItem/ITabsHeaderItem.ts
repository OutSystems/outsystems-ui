// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.TabsHeaderItem {
	/**
	 * Defines the interface for OutSystemsUI TabsHeaderItem Pattern
	 */
	export interface ITabsHeaderItem extends Interface.IChild {
		get IsActive(): boolean;
		disable();
		enable();
		getDataTab();
		setAriaControlsAttribute(contentItemId: string);
		setDataTab(dataTab: number);
		setFocus();
		setIsActive();
		unsetIsActive();
	}
}
