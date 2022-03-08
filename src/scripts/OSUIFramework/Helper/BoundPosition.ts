// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	export abstract class BoundPosition {
		/**
		 *
		 *
		 * @param elem
		 * @param viewportElem
		 * @returns
		 */
		public static IsOutside(
			element: HTMLElement,
			offsetXValue = 0,
			offsetYValue = 0,
			viewportElement: HTMLElement = document.body
		): void {
			// Get element Bounds and sizes
			const elementBound = element.getBoundingClientRect();
			const elementHeight = elementBound.height + offsetYValue;
			const elementWidth = elementBound.width + offsetXValue;

			// Get viewport element Bounds and sizes
			const viewportElementBound = viewportElement.getBoundingClientRect();
			const viewportElementHeight = viewportElementBound.height;
			const viewportElementWidth = viewportElementBound.width;

			// Check if it's out of the viewport on each side
			const out = {
				top: elementBound.top < viewportElementBound.top,
				right: elementBound.right > viewportElementBound.right,
				bottom: elementBound.bottom > viewportElementBound.bottom,
				left: elementBound.left < viewportElementBound.left,
			};

			// The item is out at top of viewportElem but has bigger height, so open it to bottom does not solve the issue!
			if (out.top && elementHeight > viewportElementHeight) {
				out.top = false;
			}
			// Since it has a smaller height than the viewportElem and doesn't fit at top position, check if fits at bottom!
			else if (out.top && elementBound.top >= 0 && elementBound.top - viewportElementBound.top < elementHeight) {
				out.top = false;
			}

			// Same as above but in right position
			if (out.right && elementWidth > viewportElementWidth) {
				out.right = false;
			}
			// Since it has a smaller width than the viewportElem and doesn't fit at right position, check if fits at left!
			else if (out.right && Math.abs(elementBound.left - viewportElementBound.left) < elementWidth) {
				out.right = false;
			}

			// Same as above but regarding bottom position
			if (out.bottom && elementHeight > viewportElementHeight) {
				out.bottom = false;
			}
			// Since it has a smaller height than the viewportElem and doesn't fit at bottom position, check if fits at top!
			else if (out.bottom && Math.abs(elementBound.bottom - viewportElementBound.bottom) < elementHeight) {
				out.top = false;
			}

			// Same as above but regarding left position
			if (out.left && elementWidth > viewportElementWidth) {
				out.bottom = false;
			}
			// Since it has a smaller width than the viewportElem and doesn't fit at left position, check if fits at right!
			else if (out.left && Math.abs(elementBound.right - viewportElementBound.right) < elementWidth) {
				out.right = false;
			}

			console.log(out);
		}
	}
}
