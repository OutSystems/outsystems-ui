// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.TabsHeaderItem {
	/**
	 * Defines the interface for OutSystemsUI TabsHeaderItem Pattern
	 */
	export interface ITabsHeaderItem extends Interface.IChild {
		getDataTab();
		unsetIsActive();
		setIsActive();
		setAriaControlsAttribute(contentItemId: string);
		setDataTab(dataTab: number);
		setFocus();
	}
}
