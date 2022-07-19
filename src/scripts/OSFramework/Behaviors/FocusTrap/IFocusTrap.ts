// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Behaviors.FocusTrap {
	export interface IFocusTrap {
		/**
		 * Signature method to set the focus on element
		 *
		 * @memberof IFocusTrap
		 */
		setFocusOnElement(focusableElement: HTMLElement, selfElement: HTMLElement): void;
	}
}
