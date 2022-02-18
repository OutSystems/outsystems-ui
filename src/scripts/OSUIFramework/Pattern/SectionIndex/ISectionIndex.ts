// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.SectionIndex {
	/**
	 * Defines the interface for OutSystemsUI SectionIndex Pattern
	 *
	 * @export
	 * @interface ISectionIndex
	 * @extends {Interface.IPattern}
	 */
	export interface ISectionIndex extends Interface.IPattern {
		addSectionIndexItem(uniqueId: string, sectionIndexItem: SectionIndexItem.ISectionIndexItem);
		setActiveElement(targetElement: Patterns.SectionIndexItem.ISectionIndexItem);
	}
}
