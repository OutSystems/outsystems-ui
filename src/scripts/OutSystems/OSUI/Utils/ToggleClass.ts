// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * [Deprecated] Function used to Toogle a class to a given element
	 *
	 * @export
	 * @param {HTMLElement} el
	 * @param {*} state
	 * @param {string} className
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ToggleClass(el: HTMLElement, state: any, className: string): void {
		const classList = el.classList;

		if (!state) {
			setTimeout(function () {
				if (!state) {
					classList.remove(className);
				}
			}, 500);
		} else {
			classList.add(className);
			el.offsetHeight;
		}
	}
}
