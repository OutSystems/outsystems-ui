// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.ButtonLoading {
	/**
	 * Defines the interface for OutSystemsUI ButtonLoading Pattern
	 *
	 * @export
	 * @interface IButtonLoading
	 * @extends {Interface.IPattern}
	 */
	export interface IButtonLoading extends Interface.IPattern {
		/**
		 * Forces the disabled attribute on the button element to be managed when IsLoading is true.
		 *
		 * @param {boolean} isDisabled When true, the button is disabled while IsLoading is true.
		 */
		disabledStateOnIsLoading(isDisabled: boolean): void;
	}
}
