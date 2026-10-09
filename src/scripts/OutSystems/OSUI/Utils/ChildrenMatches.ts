// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * Function to get a children matching a specific selector
	 *
	 * @param elem Element whose children are inspected
	 * @param selector CSS selector to match
	 */
	export function ChildrenMatches(elem: HTMLElement, selector: string): Element[] {
		let matchingChildren = [];

		if (elem) {
			matchingChildren = [...elem.children].filter((child) => child.matches(selector));
		}

		return matchingChildren;
	}
}
