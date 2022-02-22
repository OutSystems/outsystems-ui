// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.SectionIndexItem {
	/**
	 * Defines the interface for OutSystemsUI SectionIndexItem Pattern
	 *
	 * @export
	 * @interface ISectionIndexItem
	 * @extends {Interface.IPattern}
	 */
	export interface ISectionIndexItem extends Interface.IPattern {
		sectionIndexItemTargetId: string;
		removeActiveElement();
		setActiveElement();
	}
}
