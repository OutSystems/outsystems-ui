// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * Function to get a children matching a specific selector
	 *
	 * @param elem
	 * @param selector
	 */
	export function ChildrenMatches(elem: HTMLElement, selector: string): Element[] {
		let matchingChildren: Element[] = [];

		if (elem) {
			matchingChildren = [...elem.children].filter((child) => child.matches(selector));
		}

		return matchingChildren;
	}
}
