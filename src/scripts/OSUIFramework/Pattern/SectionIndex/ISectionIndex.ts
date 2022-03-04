// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.SectionIndex {
	/**
	 * Defines the interface for OutSystemsUI SectionIndex Pattern
	 *
	 * @export
	 * @interface ISectionIndex
	 * @extends {Interface.IPattern}
	 */
	export interface ISectionIndex extends Interface.IParent {
		setActiveElement(targetElement: Patterns.SectionIndexItem.ISectionIndexItem);
	}
}
