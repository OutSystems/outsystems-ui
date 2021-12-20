// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.TabsHeaderItem {
	/**
	 * Defines the interface for OutSystemsUI TabsHeaderItem Pattern
	 */
	export interface ITabsHeaderItem extends Interface.IPattern {
		getDataTab();
		removeActiveElement();
		setActiveElement();
		setAriaControlsAttribute(contentItemId: string);
		setDataTab(dataTab: number);
		setFocus();
	}
}
