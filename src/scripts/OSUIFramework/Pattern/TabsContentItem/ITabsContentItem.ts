// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.TabsContentItem {
	/**
	 * Defines the interface for OutSystemsUI TabsContentItem Pattern
	 */
	export interface ITabsContentItem extends Interface.IPattern {
		getDataTab();
		getOffsetLeft();
		removeAsActiveElement();
		removeDragObserver(observer: IntersectionObserver);
		setAriaLabelledByAttribute(headerItemId: string);
		setAsActiveElement();
		setDataTab(dataTab: number);
		setOnDragObserver(observer: IntersectionObserver);
	}
}
