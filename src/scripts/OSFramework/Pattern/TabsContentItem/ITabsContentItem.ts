// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.TabsContentItem {
	/**
	 * Defines the interface for OutSystemsUI TabsContentItem Pattern
	 */
	export interface ITabsContentItem extends Interface.IChild {
		get IsActive(): boolean;

		getDataTab(): number;
		getOffsetLeft(): number;
		setAriaLabelledByAttribute(headerItemId: string): void;
		setDataTab(dataTab: number): void;
		setIsActive(): void;
		setOnDragObserver(observer: IntersectionObserver): void;
		unobserveDragObserver(observer: IntersectionObserver): void;
		unsetIsActive(): void;
	}
}
