// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * [Deprecated] Function to get closest element, in use by AnimatedLabel
	 *
	 * @param elem
	 * @param selector
	 */
	//TODO: Is this function necessary?
	export function GetClosest(elem: HTMLElement, selector: string): unknown {
		return elem.closest(selector) ? elem.closest(selector) : false;
	}
}
