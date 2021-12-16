// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.TabsContentItem {
	/**
	 * Defines the interface for OutSystemsUI TabsContentItem Pattern
	 */
	export interface ITabsContentItem extends Interface.IPattern {
		getDataTab();
		getOffsetLeft();
		removeActiveElement();
		removeDragObserver(observer: IntersectionObserver);
		setActiveElement();
		setAriaLabelledByAttribute(headerItemId: string);
		setDataTab(dataTab: number);
		setOnDragObserver(observer: IntersectionObserver);
	}
}
