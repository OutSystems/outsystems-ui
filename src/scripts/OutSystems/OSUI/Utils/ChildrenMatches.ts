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
	export function ChildrenMatches(elem: HTMLElement, selector: string): Element[] {
		let matchingChildren = [];

		if (elem) {
			matchingChildren = [...elem.children].filter((child) => child.matches(selector));
		}

		return matchingChildren;
	}
}
