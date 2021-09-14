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
	export function MoveElement(element: HTMLElement, target: string): void {
		if (target && element) {
			const DOMTarget = document.querySelector(target);

			if (element && DOMTarget) {
				DOMTarget.appendChild(element);
			}
		}
	}
}
