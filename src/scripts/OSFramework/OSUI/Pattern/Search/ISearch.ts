// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Search {
	/**
	 * Defines the interface for OutSystemsUI Search Pattern
	 */
	export interface ISearch extends Interface.IPattern {
		/**
		 * Returns the value of native Search behavior
		 *
		 * @type {boolean}
		 * @memberof ISearch
		 */
		IsNativeEnabled: boolean;

		/**
		 * Returns the value of Search visibility
		 *
		 * @type {boolean}
		 * @memberof ISearch
		 */
		IsOpen: boolean;

		/**
		 * Method to enable native behavior of search inside the layout native >> header-right
		 *
		 * @memberof ISearch
		 */
		enableNativeBehavior(): void;

		/**
		 * Method to update the aria-label on glass button when has the native behavior enabled
		 *
		 * @memberof ISearch
		 */
		setAriaLabel(ariaLabel: string): void;
	}
}
