// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.SectionIndexItem {
	/**
	 * Defines the interface for OutSystemsUI SectionIndexItem Pattern
	 */
	export interface ISectionIndexItem extends Interface.IChild {
		/**
		 * Readable property to get the active state of the element
		 */
		IsSelected: boolean;

		/**
		 * Readable property to get targetElement object
		 */
		TargetElement: HTMLElement;

		/**
		 * Method to add the active state
		 */
		setIsActive(): void;

		/**
		 * Method to remove the active state
		 */
		unsetIsActive(): void;
	}
}
