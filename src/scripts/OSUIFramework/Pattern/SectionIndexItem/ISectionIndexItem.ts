// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.SectionIndexItem {
	/**
	 * Defines the interface for OutSystemsUI SectionIndexItem Pattern
	 *
	 * @export
	 * @interface ISectionIndexItem
	 * @extends {Interface.IChild}
	 */
	export interface ISectionIndexItem extends Interface.IChild {
		setIsActive();
		get targetElement(): HTMLElement;
		get targetElementOffset(): SectionIndexItemOffsetInfo;
		unsetIsActive();
	}
}
