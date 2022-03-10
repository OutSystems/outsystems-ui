/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSUIFramework.Helper {
	/**
	 * Trigger a scroll navigation into a given offset position
	 *
	 * @param {HTMLElement} element Element where the scroll will happen
	 * @param offSet Offset values
	 * @param isSmooth True if the scroll should be smooth
	 */
	export function Scroll(element: HTMLElement, offSet: OffsetValues, isSmooth = true): void {
		if (element) {
			// Set the options to set at the Scroll fucntion
			const scrollOpts = {
				...offSet,
				behavior: isSmooth ? GlobalEnum.ScrollBehavior.Smooth : GlobalEnum.ScrollBehavior.Auto,
			};

			// Trigger the scroll navigation!
			element.scroll(scrollOpts);
		}
	}
}
