// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	export abstract class BoundPosition {
		/**
		 * Method that can be used to test if a given element is outside of a testAgainstElement boudaries
		 *
		 * @param element Element to check if is outside of boundaries
		 * @param testAgainstElement Element where the boundaries will be tested
		 * @param elementOffset Element Offset values to be taken in consideration
		 * @returns {OutOfBoundaries}
		 */
		public static Check(
			element: HTMLElement,
			testAgainstElement: HTMLElement = document.body,
			elementOffset: number | OffsetValues = { top: 0, right: 0, bottom: 0, left: 0 }
		): OutOfBoundaries {
			// Set element Bounds
			const elementBounds = element.getBoundingClientRect();
			// Set AgainstElement Bounds
			const againstElementBounds = testAgainstElement.getBoundingClientRect();
			// Set the offset values according it's same value for all sides or different value for each side
			const offSetValues = {
				top: typeof elementOffset === 'number' ? elementOffset : elementOffset.top,
				right: typeof elementOffset === 'number' ? elementOffset : elementOffset.right,
				bottom: typeof elementOffset === 'number' ? elementOffset : elementOffset.bottom,
				left: typeof elementOffset === 'number' ? elementOffset : elementOffset.left,
			};

			// Check if Element it's out of the AgainstElement boundaries
			const isOut: OutOfBoundaries = {
				top: elementBounds.top + offSetValues.top < againstElementBounds.top,
				right: elementBounds.right - offSetValues.right > againstElementBounds.right,
				bottom: elementBounds.bottom - offSetValues.bottom > againstElementBounds.bottom,
				left: elementBounds.left + offSetValues.left < againstElementBounds.left,
			};

			return isOut;
		}

		/**
		 * Method that could be used to get a Recomended position from an element if it is ouside of boudaries of a given testAgainstElement
		 *
		 * @param element Element to check if is outside of boundaries
		 * @param testAgainstElement Element where the boundaries will be tested
		 * @param elementOffset Element Offset values to ba take in consideration
		 * @returns {string | undefined} Suggested position (Based on GlobalEnum.Position)
		 */
		public static GetRecomendedPosition(
			element: HTMLElement,
			testAgainstElement: HTMLElement = document.body,
			elementOffset: number | OffsetValues = { top: 0, right: 0, bottom: 0, left: 0 }
		): string | undefined {
			// Store the recomended position
			let recomendedPosition = undefined;
			// Set the Boundaries status of the given Element related with the AgainstElement boundaries
			const checkOutOfBounds = BoundPosition.Check(element, testAgainstElement, elementOffset);

			// If Element is not Outside of AgainstElement boundaries do not suggest a position!
			if (Object.values(checkOutOfBounds).filter((val) => val).length === 0) {
				return undefined;
			}

			// Set element Bounds
			const elementBounds = element.getBoundingClientRect();
			// Set AgainstElement Bounds
			const againstElementBounds = testAgainstElement.getBoundingClientRect();

			// If Element size (width or height) higher AgainstElement
			if (
				elementBounds.height > againstElementBounds.height ||
				elementBounds.width > againstElementBounds.width
			) {
				// Doesn't matter if it's out of boundaries since it doesn't fit inside AgainstElement
				checkOutOfBounds.top = false;
				checkOutOfBounds.right = false;
				checkOutOfBounds.bottom = false;
				checkOutOfBounds.left = false;
			}

			// Is Out of Left boundary?
			if (checkOutOfBounds.left) {
				// Recomend open it at Right!
				recomendedPosition = GlobalEnum.Position.Right;
			}

			// Is Out of Right boundary?
			if (checkOutOfBounds.right) {
				// Recomend open it at Left!
				recomendedPosition = GlobalEnum.Position.Left;
			}

			// Is Out of Left boundary?
			if (checkOutOfBounds.top) {
				// By default, recomend open it at Right!
				recomendedPosition = GlobalEnum.Position.Bottom;

				// Is Out of TopLeft boundary?
				if (checkOutOfBounds.left) {
					// Recomend open it at BottomRight!
					recomendedPosition = GlobalEnum.Position.BottomRight;

					// Is Out of TopRight boundary?
				} else if (checkOutOfBounds.right) {
					// Recomend open it at BottomLeft!
					recomendedPosition = GlobalEnum.Position.BottomLeft;
				}
			}

			// Is Out of Bottom boundary?
			if (checkOutOfBounds.bottom) {
				// By default, recomend open it at Top!
				recomendedPosition = GlobalEnum.Position.Top;

				// Is Out of BottomLeft boundary?
				if (checkOutOfBounds.left) {
					// Recomend open it at TopRight!
					recomendedPosition = GlobalEnum.Position.TopRight;

					// Is Out of BottomRight boundary?
				} else if (checkOutOfBounds.right) {
					// Recomend open it at TopLeft!
					recomendedPosition = GlobalEnum.Position.TopLeft;
				}
			}

			return recomendedPosition;
		}
	}
}
