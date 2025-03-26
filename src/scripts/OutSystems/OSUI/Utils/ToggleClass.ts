// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * [Deprecated] Function used to Toogle a class to a given element
	 *
	 * @export
	 * @param {HTMLElement} element
	 * @param {*} state
	 * @param {string} className
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ToggleClass(element: HTMLElement, state: any, className: string): void {
		if (!state) {
			setTimeout(function () {
				if (!state) {
					OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(element, className);
				}
			}, 500);
		} else {
			OSFramework.OSUI.Helper.Dom.Styles.AddClass(element, className);
			element.offsetHeight;
		}
	}
}
