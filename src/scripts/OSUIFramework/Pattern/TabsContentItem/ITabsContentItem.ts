// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.TabsContentItem {
	/**
	 * Defines the interface for OutSystemsUI TabsContentItem Pattern
	 */
	export interface ITabsContentItem extends Interface.IChild {
		get IsActive(): boolean;
		getDataTab();
		getOffsetLeft();
		setAriaLabelledByAttribute(headerItemId: string);
		setDataTab(dataTab: number);
		setIsActive();
		setOnDragObserver(observer: IntersectionObserver);
		unobserveDragObserver(observer: IntersectionObserver);
		unsetIsActive();
	}
}
