// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tooltip {
	type boundsReturnCalc = {
		newPositionCssClass: string | undefined;
		oldPositionCssClass: string | undefined;
	};

	export abstract class BoundsPosition {
		private static readonly _positionMatch: Map<string, GlobalEnum.Position> = new Map();

		private static get positionMatch() {
			if (BoundsPosition._positionMatch.size === 0) {
				const keys = Object.keys(GlobalEnum.Position);
				keys.forEach((key) =>
					BoundsPosition._positionMatch.set(GlobalEnum.Position[key], key as unknown as GlobalEnum.Position)
				);
			}
			return BoundsPosition._positionMatch;
		}

		/**
		 * Recursive function that will be test if the given element has an overflow hidden property, it will be calling himself until body element if any parentNode has a overflow hidden property. If a parentNode has a position fixed, it will break the loop.
		 *
		 * @private
		 * @static
		 * @param {HTMLElement} elem Element where the overflow:hidden or position:fixed will be looked for
		 * @return {*}  {HTMLElement}
		 * @memberof BoundsPosition
		 */
		private static _hasOverflowHiddenProp(elem: HTMLElement): HTMLElement {
			// Check if the given element is the body or the app wrapper container
			if (elem === document.body || elem.classList.contains('screen-container')) {
				return null;
			} else if (window.getComputedStyle(elem).getPropertyValue('overflow').indexOf('hidden') < 0) {
				if (window.getComputedStyle(elem).getPropertyValue('position').indexOf('fixed') > -1) {
					// Element with an position:fixed was found!
					return null;
				} else {
					// overflow:hidden and position:fixed was not found at given element, test the given element parent
					return BoundsPosition._hasOverflowHiddenProp(elem.parentElement);
				}
			} else {
				// Element with an overflow:hidden was found!
				return elem;
			}
		}

		/**
		 * Function to test the boundaries of the given element against the given viewElement, If the position must be added or changed this function will return it
		 *
		 * @private
		 * @static
		 * @param {HTMLElement} elem Element to be tested boundaries
		 * @param {HTMLElement} viewElem Context Element where the elem boundaries will be tested
		 * @param {(string | boolean)} [activePosition]
		 * @return {*}  {(boolean | string)}
		 * @memberof BoundsPosition
		 */
		private static _isItemOutOfViewElemBounds(
			elem: HTMLElement,
			viewElem: HTMLElement,
			activePosition?: string | boolean
		): string | undefined {
			// Get Bounds element and sizes
			const elemBound = elem.getBoundingClientRect();
			const elemHeight = elem.clientHeight;
			const elemWidth = elem.clientWidth;

			const viewElemBound = viewElem.getBoundingClientRect();
			const viewElemHeight = viewElem.clientHeight;
			const viewElemWidth = viewElem.clientWidth;

			// Check if it's out of the viewport on each side
			const out = {
				top: elemBound.top < viewElemBound.top,
				right: elemBound.right > viewElemBound.right,
				bottom: elemBound.bottom > viewElemBound.bottom,
				left: elemBound.left < viewElemBound.left,
			};

			// The item is out at top of viewElem but has bigger height, so open it to bottom does not solve the issue!
			if (out.top && elemHeight > viewElemHeight) {
				out.top = false;
			}
			// Since it has a smaller height than the viewElem and doesn't fit at top position, check if fits at bottom!
			else if (out.top && Math.abs(elemBound.top - viewElemBound.top) < elemHeight) {
				out.top = false;
			}

			// Same as above but in right position
			if (out.right && elemWidth > viewElemWidth) {
				out.right = false;
			}
			// Since it has a smaller width than the viewElem and doesn't fit at right position, check if fits at left!
			else if (out.right && Math.abs(elemBound.left - viewElemBound.left) < elemWidth) {
				out.right = false;
			}

			// Same as above but regarding bottom position
			if (out.bottom && elemHeight > viewElemHeight) {
				out.bottom = false;
			}
			// Since it has a smaller height than the viewElem and doesn't fit at bottom position, check if fits at top!
			else if (out.bottom && Math.abs(elemBound.bottom - viewElemBound.bottom) < elemHeight) {
				out.top = false;
			}

			// Same as above but regarding left position
			if (out.left && elemWidth > viewElemWidth) {
				out.bottom = false;
			}
			// Since it has a smaller width than the viewElem and doesn't fit at left position, check if fits at right!
			else if (out.left && Math.abs(elemBound.right - viewElemBound.right) < elemWidth) {
				out.right = false;
			}

			// There are no issues with the defined position!
			if (!(out.top || out.left || out.bottom || out.right)) {
				return undefined;
			}

			// Since a position issue has found, check the new position to be added to the given element
			let openAt = undefined;

			// Is out of Top boundary
			if (out.top) {
				switch (activePosition) {
					case GlobalEnum.Position.Center:
					case GlobalEnum.Position.Top:
						if (out.right) {
							openAt = GlobalEnum.Position.BottomLeft;
						} else if (out.left) {
							openAt = GlobalEnum.Position.BottomRight;
						} else if (activePosition === GlobalEnum.Position.Top) {
							openAt = GlobalEnum.Position.Bottom;
						}
						break;

					case GlobalEnum.Position.TopRight:
					case GlobalEnum.Position.TopLeft:
						openAt = GlobalEnum.Position.BottomLeft;

						if (out.right) {
							openAt = GlobalEnum.Position.BottomLeft;
						} else if (out.left) {
							openAt = GlobalEnum.Position.BottomRight;
						} else if (activePosition === GlobalEnum.Position.TopRight) {
							openAt = GlobalEnum.Position.BottomRight;
						}
						break;
				}
			}
			// Is out of Right boundary
			else if (out.right) {
				openAt = GlobalEnum.Position.Left;

				switch (activePosition) {
					case GlobalEnum.Position.Center:
						if (out.bottom) {
							openAt = GlobalEnum.Position.TopLeft;
						} else if (out.left) {
							openAt = GlobalEnum.Position.Left;
						}
						break;

					case GlobalEnum.Position.Top:
					case GlobalEnum.Position.TopRight:
						openAt = GlobalEnum.Position.TopLeft;
						break;

					case GlobalEnum.Position.Bottom:
					case GlobalEnum.Position.BottomRight:
						if (out.bottom) {
							openAt = GlobalEnum.Position.TopLeft;
						}
						break;
				}
			}
			// Is out of Bottom boundary
			else if (out.bottom) {
				switch (activePosition) {
					case GlobalEnum.Position.Center:
					case GlobalEnum.Position.Bottom:
						if (out.right) {
							openAt = GlobalEnum.Position.TopLeft;
						} else if (out.left) {
							openAt = GlobalEnum.Position.TopRight;
						} else if (activePosition === GlobalEnum.Position.Bottom) {
							openAt = GlobalEnum.Position.Top;
						}
						break;

					case GlobalEnum.Position.BottomRight:
					case GlobalEnum.Position.BottomLeft:
						if (out.right) {
							openAt = GlobalEnum.Position.TopLeft;
						} else if (out.left) {
							openAt = GlobalEnum.Position.TopRight;
						} else if (activePosition === GlobalEnum.Position.BottomRight) {
							openAt = GlobalEnum.Position.TopRight;
						} else {
							openAt = GlobalEnum.Position.TopLeft;
						}
						break;
				}
			}
			// Is out of Left boundary
			else if (out.left) {
				openAt = GlobalEnum.Position.Right;

				switch (activePosition) {
					case GlobalEnum.Position.Center:
						openAt = GlobalEnum.Position.Right;
						break;

					case GlobalEnum.Position.Top:
						openAt = GlobalEnum.Position.TopRight;
						break;

					case GlobalEnum.Position.TopLeft:
						openAt = GlobalEnum.Position.TopRight;
						break;
				}
			}

			return openAt;
		}

		/**
		 * Function to be used to check the position where the given element must open if it's out of viewport or has an overflow hidden container as a parent
		 *
		 * @static
		 * @param {HTMLElement} elem Pattern element (typically _selfElem), it will be used to check for a parentNode with a overflow hidden property
		 * @param {HTMLElement} elemToTest Element that will be (or not) placed into the new position
		 * @param {HTMLElement} elemToAddCssClassPos Element where the cssClass must be managed to change (or not) the elemToTest position
		 * @return {*}  {boundsReturnCalc}
		 * @memberof BoundsPosition
		 */
		public static CalcBounds(
			elem: HTMLElement,
			elemToTest: HTMLElement,
			elemToAddCssClassPos: HTMLElement
		): boundsReturnCalc {
			// Info that will be returned
			const _infoToReturn: boundsReturnCalc = {
				newPositionCssClass: undefined,
				oldPositionCssClass: undefined,
			};

			// Store the new position if it will have one
			let _newItemPosition: string = undefined;

			// Check if the element has already a defined class position
			const _checkIfElementPosition = BoundsPosition.GetElementPositionClass(elemToAddCssClassPos);

			// Check if there are any parentNode with the overflow hidden property
			const _overflowElem = BoundsPosition._hasOverflowHiddenProp(elem.parentElement);
			if (_overflowElem) {
				// Check if the element is out of the founded parentNode view boundaries
				_newItemPosition = BoundsPosition._isItemOutOfViewElemBounds(
					elemToTest,
					_overflowElem,
					_checkIfElementPosition
				);
			} else {
				// If there are not a parentNode with the overflow hidden, check the body boudaries
				_newItemPosition = BoundsPosition._isItemOutOfViewElemBounds(
					elemToTest,
					document.body,
					_checkIfElementPosition
				);
			}

			// Check if the old cssClass position must be removed!
			if (_newItemPosition && _checkIfElementPosition && _newItemPosition !== _checkIfElementPosition) {
				_infoToReturn.oldPositionCssClass = _checkIfElementPosition;
			}

			// If a new position cssClass must be added
			if (_newItemPosition) {
				_infoToReturn.newPositionCssClass = _newItemPosition;
			}

			return _infoToReturn;
		}

		/**
		 * Method that will look for a cssClass Position on a given element.
		 *
		 * @static
		 * @param {HTMLElement} element Element where the cssClass will be looked for.
		 * @return {*}  {string} returns the class name that represents the position. In case there no position class defined, return undefined.
		 * @memberof StyleManipulation
		 */
		public static GetElementPositionClass(element: HTMLElement): string | undefined {
			if (element) {
				const cssClasses = Helper.Dom.Styles.GetCssClasses(element);
				for (const positionClass in GlobalEnum.Position) {
					if (cssClasses.has(GlobalEnum.Position[positionClass])) {
						return GlobalEnum.Position[positionClass];
					}
				}
				return undefined;
			} else {
				throw Error('The element does not exist, when trying to check for position class.');
			}
		}

		/**
		 * Method that gets the GlobalEnum.Position Identifier based on the Position class.
		 *
		 * @static
		 * @param {string} cssClass
		 * @return {*}  {(GlobalEnum.Position | undefined)}
		 * @memberof BoundsPosition
		 */
		public static GetPositionByClass(cssClass: string): GlobalEnum.Position | undefined {
			return BoundsPosition.positionMatch.get(cssClass);
		}
	}
}
