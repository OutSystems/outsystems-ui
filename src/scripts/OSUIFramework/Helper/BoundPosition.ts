// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	export abstract class BoundPosition {
		// Check the state of boundaries position between two given Bound values
		private static _checkIsOutBounds(elementBounds: DOMRect, testAgainstElementBounds: DOMRect): OutOfBoundaries {
			return {
				top: elementBounds.top < testAgainstElementBounds.top,
				right: elementBounds.right > testAgainstElementBounds.right,
				bottom: elementBounds.bottom > testAgainstElementBounds.bottom,
				left: elementBounds.left < testAgainstElementBounds.left,
			};
		}

		/**
		 * Get the Body offset values counting with Header height if is there
		 *
		 * @returns {DOMRect} Body OffsetValues
		 */
		public static GetBodyBouds(): DOMRect {
			let bodyOffSetValues: DOMRect;

			const layoutElement = Helper.Dom.ClassSelector(document.body, GlobalEnum.CssClassElements.Layout);
			const isLayoutTop = layoutElement.classList.contains(GlobalEnum.CssClassElements.LayoutTop);
			const isFixedHeader = layoutElement.classList.contains(GlobalEnum.CssClassElements.HeaderIsFixed);

			if (isLayoutTop && isFixedHeader) {
				const headerElement = Helper.Dom.ClassSelector(document.body, GlobalEnum.CssClassElements.Header);
				const headerHeight = headerElement.getBoundingClientRect().height;
				const bodyRect = document.body.getBoundingClientRect();

				bodyOffSetValues = {
					bottom: bodyRect.bottom,
					height: bodyRect.height - headerHeight,
					left: bodyRect.left,
					right: bodyRect.right,
					top: headerHeight,
					width: bodyRect.width,
					x: bodyRect.x,
					y: headerHeight,
				} as DOMRect;
			} else {
				bodyOffSetValues = document.body.getBoundingClientRect();
			}

			return bodyOffSetValues;
		}

		/**
		 * Method that could be used to get a Recommended position from an element if it is ouside of boudaries of a given testAgainstElement
		 *
		 * @param element Element to check if is outside of boundaries
		 * @param testAgainstElement Element where the boundaries will be tested
		 * @param elementOffset Element Offset values to ba take in consideration
		 * @returns {string | undefined} Suggested position (Based on GlobalEnum.Position)
		 */
		public static GetRecommendedPosition(
			element: HTMLElement,
			testAgainstElement: HTMLElement = document.body,
			elementOffset: number | OffsetValues = { top: 0, right: 0, bottom: 0, left: 0 }
		): string | undefined {
			// Set the Boundaries status of the given Element related with the AgainstElement boundaries
			const checkOutOfBounds = this.IsOutBounds(element, testAgainstElement, elementOffset);

			// If Element is not Outside of AgainstElement boundaries do not suggest a position!
			if (Object.values(checkOutOfBounds).filter((val) => val).length === 0) {
				return undefined;
			}

			return this.GetRecommendedPositionByBounds(
				element.getBoundingClientRect(),
				testAgainstElement.getBoundingClientRect()
			);
		}

		/**
		 * Method that could be used on cases where we do not have the right values from the getBoundingClientRect() method - Example when the item is with height 0(zero) and we know the value height to be tested!
		 *
		 * @param elementBounds Element Bounds values to test against
		 * @param testAgainstElementBounds Element bounds values that will be tested against
		 * @returns {string | undefined} Suggested position (Based on GlobalEnum.Position)
		 */
		public static GetRecommendedPositionByBounds(
			elementBounds: DOMRect,
			testAgainstElementBounds: DOMRect
		): string | undefined {
			// Store the recommended position
			let recommendedPosition = undefined;

			// If Element size (width or height) higher AgainstElement
			if (
				elementBounds.height > testAgainstElementBounds.height ||
				elementBounds.width > testAgainstElementBounds.width
			) {
				// Doesn't matter if it's out of boundaries since it doesn't fit inside AgainstElement
				return recommendedPosition;
			}

			// Check if Element it's out of the AgainstElement boundaries
			const isOut = this._checkIsOutBounds(elementBounds, testAgainstElementBounds);

			// Is Out of Left boundary?
			if (isOut.left) {
				// Recomend open it at Right!
				recommendedPosition = GlobalEnum.Position.Right;
			}

			// Is Out of Right boundary?
			if (isOut.right) {
				// Recomend open it at Left!
				recommendedPosition = GlobalEnum.Position.Left;
			}

			// Is Out of Left boundary?
			if (isOut.top) {
				// By default, recomend open it at Right!
				recommendedPosition = GlobalEnum.Position.Bottom;
				// Is Out of TopLeft boundary?
				if (isOut.left) {
					// Recomend open it at BottomRight!
					recommendedPosition = GlobalEnum.Position.BottomRight;
					// Is Out of TopRight boundary?
				} else if (isOut.right) {
					// Recomend open it at BottomLeft!
					recommendedPosition = GlobalEnum.Position.BottomLeft;
				}
			}

			// Is Out of Bottom boundary?
			if (isOut.bottom) {
				// By default, recomend open it at Top!
				recommendedPosition = GlobalEnum.Position.Top;
				// Is Out of BottomLeft boundary?
				if (isOut.left) {
					// Recomend open it at TopRight!
					recommendedPosition = GlobalEnum.Position.TopRight;
					// Is Out of BottomRight boundary?
				} else if (isOut.right) {
					// Recomend open it at TopLeft!
					recommendedPosition = GlobalEnum.Position.TopLeft;
				}
			}

			return recommendedPosition;
		}

		/**
		 * Method that can be used to test if a given element is outside of a testAgainstElement boudaries
		 *
		 * @param element Element to check if is outside of boundaries
		 * @param testAgainstElement Element where the boundaries will be tested
		 * @param elementOffset Element Offset values to be taken in consideration
		 * @returns {OutOfBoundaries}
		 */
		public static IsOutBounds(
			element: HTMLElement,
			testAgainstElement: HTMLElement = document.body,
			elementOffset: number | OffsetValues = { top: 0, right: 0, bottom: 0, left: 0 }
		): OutOfBoundaries {
			// Get element Bounds
			const elementBounds = element.getBoundingClientRect();

			// Set the offset values according it's same value for all sides or different value for each side
			const offSetValues = {
				top: typeof elementOffset === 'number' ? elementOffset : elementOffset.top,
				right: typeof elementOffset === 'number' ? elementOffset : elementOffset.right,
				bottom: typeof elementOffset === 'number' ? elementOffset : elementOffset.bottom,
				left: typeof elementOffset === 'number' ? elementOffset : elementOffset.left,
			};

			// Set the BoundingClientRect updated with offset values and merged with default ones!
			const offSetValuesUpdated = {
				bottom: elementBounds.bottom - offSetValues.bottom,
				height: elementBounds.height,
				left: elementBounds.left + offSetValues.left,
				right: elementBounds.right - offSetValues.right,
				top: elementBounds.top + offSetValues.top,
				width: elementBounds.width,
				x: elementBounds.x,
				y: elementBounds.y,
			};

			let testAgainstElementOffSetValues: DOMRect;

			// Check if the testAgainstElement is the BODY and if there is a headerTop in order to remove it's height from calcs
			if (testAgainstElement === document.body) {
				testAgainstElementOffSetValues = this.GetBodyBouds();
			} else {
				testAgainstElementOffSetValues = testAgainstElement.getBoundingClientRect();
			}

			return this._checkIsOutBounds(offSetValuesUpdated as DOMRect, testAgainstElementOffSetValues);
		}
	}
}
