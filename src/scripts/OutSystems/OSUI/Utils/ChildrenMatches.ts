// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * Function to get a children matching a specific selector
	 *
	 * @export
	 * @param {*} elem
	 * @param {*} selector
	 * @return {*}  {*}
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export function ChildrenMatches(elem: HTMLElement, selector: string): any {
		return Array.prototype.filter.call(elem.children, function (child) {
			return child.matches(selector);
		});
	}
}
