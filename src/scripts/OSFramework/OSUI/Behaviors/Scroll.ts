/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.OSUI.Behaviors {
	const _controllScroll = {
		yValue: 0,
		yDirection: '',
	};

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
	 * @returns {ScrollPosition} ScrollPosition
	 */
	export function ScrollVerticalPosition(
		scrollableElement: HTMLElement = Helper.Dom.ClassSelector(
			document.body,
			GlobalEnum.CssClassElements.ActiveScreen
		)
	): ScrollPosition {
		// Get Scroll value
		const winScroll = scrollableElement.scrollTop;
		// Get the Scrollable height
		const height = scrollableElement.scrollHeight - scrollableElement.clientHeight;
		// Get the percentage value of Scroll
		const scrolled = Math.round((winScroll / height) * 100);
		// Get the pixel value of Scroll
		const scrolledPx = (scrollableElement.clientHeight * scrolled) / 100;

		// Check the scroll direction
		if (_controllScroll.yValue < winScroll) {
			_controllScroll.yDirection = GlobalEnum.Direction.Bottom;
		} else if (_controllScroll.yValue > winScroll) {
			_controllScroll.yDirection = GlobalEnum.Direction.Top;
		}
		_controllScroll.yValue = winScroll;

		return {
			direction: _controllScroll.yDirection as GlobalEnum.Direction,
			percentageInView: scrolled,
			pixelInView: scrolledPx,
			scrollableHeight: scrollableElement.scrollHeight,
			value: scrollableElement.scrollTop,
			viewHeight: scrollableElement.clientHeight,
		};
	}
}
