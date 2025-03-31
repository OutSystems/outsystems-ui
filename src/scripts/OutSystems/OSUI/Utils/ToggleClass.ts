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
	export function ToggleClass(element: HTMLElement, state: unknown, className: string): void {
		if (!state) {
			setTimeout(() => {
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
