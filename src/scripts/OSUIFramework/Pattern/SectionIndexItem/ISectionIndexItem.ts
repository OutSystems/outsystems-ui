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
		get IsSelected(): boolean;
		get TargetElement(): HTMLElement;
		get TargetElementOffset(): OffsetValues;

		setIsActive();
		unsetIsActive();
	}
}
