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

	/**
	 * Get the Sroll Vertical position based on viewport height
	 *
	 * @param scrollableElement Element where the scroll will happen
	 * @returns
	 */
	export function ScrollVerticalPosition(
		scrollableElement: HTMLElement = Helper.Dom.ClassSelector(document.body, GlobalEnum.Screen.Active)
	): ScrollPosition {
		const winScroll = scrollableElement.scrollTop;
		const height = scrollableElement.scrollHeight - scrollableElement.clientHeight;
		const scrolled = Math.round((winScroll / height) * 100);
		const scrolledPx = (scrollableElement.clientHeight * scrolled) / 100;

		return {
			percentage: scrolled,
			pixel: scrolledPx,
		};
	}
}
