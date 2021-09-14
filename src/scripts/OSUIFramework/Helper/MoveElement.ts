/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSUIFramework.Helper {
	/**
	 * Generate a Random Sting that could be assigned as a pattern UniqueId
	 *
	 * @export
	 * @param element Identificator of the the HTMElement to be moved
	 * @param target Identificator of the HTMLElement where the element should be moved.
	 * @return
	 */
	export function MoveElement(element: string, target: string): void {
		if (target && element) {
			const screenEl = document.getElementById(element);
			const DOMTarget = document.querySelector(target);

			if (screenEl && DOMTarget) {
				DOMTarget.appendChild(screenEl);
			}
		}
	}
}
