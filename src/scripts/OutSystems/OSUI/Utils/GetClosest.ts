// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * [Deprecated] Function to get closest element, in use by AnimatedLabel
	 *
	 * @export
	 * @param {HTMLElement} elem
	 * @param {string} selector
	 * @return {*}  {*}
	 *
	 */
	//TODO: Is this function necessary?
	export function GetClosest(elem: HTMLElement, selector: string): unknown {
		return elem.closest(selector) ? elem.closest(selector) : false;
	}
}
