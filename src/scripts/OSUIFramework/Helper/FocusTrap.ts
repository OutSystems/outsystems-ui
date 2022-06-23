// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	export abstract class FocusTrap {
		/**
		 * Method to focus on first element inside the block
		 *
		 * @static
		 * @param {HTMLElement} firstFocusableElement
		 * @param {HTMLElement} selfElement
		 * @memberof FocusTrap
		 */
		public static FocusOnFirstFocusableElement(firstFocusableElement: HTMLElement, selfElement: HTMLElement): void {
			if (firstFocusableElement) {
				firstFocusableElement.focus();
			} else {
				selfElement?.focus();
			}
		}

		/**
		 * Method to focus on last element inside the block
		 *
		 * @static
		 * @param {HTMLElement} lastFocusableElement
		 * @param {HTMLElement} selfElement
		 * @memberof FocusTrap
		 */
		public static FocusOnLastFocusableElement(lastFocusableElement: HTMLElement, selfElement: HTMLElement): void {
			if (lastFocusableElement) {
				lastFocusableElement.focus();
			} else {
				selfElement?.focus();
			}
		}
	}
}
