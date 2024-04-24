// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.SectionIndexItem {
	/**
	 * Defines the interface for OutSystemsUI SectionIndexItem Pattern
	 *
	 * @export
	 * @interface ISectionIndexItem
	 * @extends {Interface.IChild}
	 */
	export interface ISectionIndexItem extends Interface.IChild {
		/**
		 * Readable property to get the active state of the element
		 *
		 * @type {boolean}
		 * @memberof ISectionIndexItem
		 */
		IsSelected: boolean;

		/**
		 * Readable property to get targetElement object
		 *
		 * @type {HTMLElement}
		 * @memberof ISectionIndexItem
		 */
		TargetElement: HTMLElement;

		/**
		 * Method to add the active state
		 *
		 * @memberof ISectionIndexItem
		 */
		setIsActive(): void;

		/**
		 * Method to remove the active state
		 *
		 * @memberof ISectionIndexItem
		 */
		unsetIsActive(): void;
	}
}
