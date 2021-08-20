// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tooltip.BoundsPosition {
	type boundsReturnCalc = { addCssClassPos: string | boolean; removeCssClassPos: string | boolean };

	/**
	 * Recursive function that will be test if the given element has an overflow hidden property, it will be calling himself until body element if any parentNode has a overflow hidden property. If a parentNode has a position fixed, it will break the loop.
	 *
	 * @param {HTMLElement} elem Element where the overflow:hidden or position:fixed will be looked for
	 * @return {*}  {HTMLElement}
	 */
	function HasOverflowHiddenProp(elem: HTMLElement): HTMLElement {
		// Check if the given element is the body or the app wrapper container
		if (elem === document.body || elem.classList.contains('screen-container')) {
			return null;
		} else if (window.getComputedStyle(elem).getPropertyValue('overflow').indexOf('hidden') < 0) {
			if (window.getComputedStyle(elem).getPropertyValue('position').indexOf('fixed') > -1) {
				// Element with an position:fixed was found!
				return null;
			} else {
				// overflow:hidden and position:fixed was not found at given element, test the given element parent
				return HasOverflowHiddenProp(elem.parentElement);
			}
		} else {
			// Element with an overflow:hidden was found!
			return elem;
		}
	}

	/**
	 * Function to test the boundaries of the given element against the given viewElement, If the position must be added or changed this function will return it
	 *
	 * @param {HTMLElement} elem Element to be tested boundaries
	 * @param {HTMLElement} viewElem Context Element where the elem boundaries will be tested
	 * @return {*}  {(boolean | string)}
	 */
	function IsItemOutOfViewElemBounds(
		elem: HTMLElement,
		viewElem: HTMLElement,
		activePosition?: string | boolean
	): boolean | string {
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
			return false;
		}

		// Since a position issue has found, check the new position to be added to the given element
		let openAt = '';

		// Is out of Top boundary
		if (out.top) {
			switch (activePosition) {
				case GlobalEnum.OSUICssClassPosition.center:
					if (out.right) {
						openAt = GlobalEnum.OSUICssClassPosition.top;
					} else if (out.left) {
						openAt = GlobalEnum.OSUICssClassPosition.topRight;
					}
					break;

				case GlobalEnum.OSUICssClassPosition.top:
					openAt = GlobalEnum.OSUICssClassPosition.bottom;

					if (out.right) {
						openAt = GlobalEnum.OSUICssClassPosition.bottomLeft;
					} else if (out.left) {
						openAt = GlobalEnum.OSUICssClassPosition.bottomRight;
					}
					break;

				case GlobalEnum.OSUICssClassPosition.topRight:
					openAt = GlobalEnum.OSUICssClassPosition.bottomRight;

					if (out.right) {
						openAt = GlobalEnum.OSUICssClassPosition.bottomLeft;
					} else if (out.left) {
						openAt = GlobalEnum.OSUICssClassPosition.bottomRight;
					}
					break;

				case GlobalEnum.OSUICssClassPosition.topLeft:
					openAt = GlobalEnum.OSUICssClassPosition.bottomLeft;

					if (out.right) {
						openAt = GlobalEnum.OSUICssClassPosition.bottomLeft;
					} else if (out.left) {
						openAt = GlobalEnum.OSUICssClassPosition.bottomRight;
					}
					break;
			}
		}
		// Is out of Right boundary
		else if (out.right) {
			openAt = GlobalEnum.OSUICssClassPosition.left;

			switch (activePosition) {
				case GlobalEnum.OSUICssClassPosition.center:
					if (out.bottom) {
						openAt = GlobalEnum.OSUICssClassPosition.topLeft;
					} else if (out.left) {
						openAt = GlobalEnum.OSUICssClassPosition.left;
					}
					break;

				case GlobalEnum.OSUICssClassPosition.top:
					openAt = GlobalEnum.OSUICssClassPosition.topLeft;
					break;

				case GlobalEnum.OSUICssClassPosition.topRight:
					openAt = GlobalEnum.OSUICssClassPosition.topLeft;
					break;

				case GlobalEnum.OSUICssClassPosition.bottom:
					if (out.bottom) {
						openAt = GlobalEnum.OSUICssClassPosition.topLeft;
					}
					break;

				case GlobalEnum.OSUICssClassPosition.bottomRight:
					if (out.bottom) {
						openAt = GlobalEnum.OSUICssClassPosition.topLeft;
					}
					break;
			}
		}
		// Is out of Bottom boundary
		else if (out.bottom) {
			switch (activePosition) {
				case GlobalEnum.OSUICssClassPosition.center:
					if (out.right) {
						openAt = GlobalEnum.OSUICssClassPosition.topLeft;
					} else if (out.left) {
						openAt = GlobalEnum.OSUICssClassPosition.topRight;
					}
					break;

				case GlobalEnum.OSUICssClassPosition.bottom:
					openAt = GlobalEnum.OSUICssClassPosition.top;

					if (out.right) {
						openAt = GlobalEnum.OSUICssClassPosition.topLeft;
					} else if (out.left) {
						openAt = GlobalEnum.OSUICssClassPosition.topRight;
					}
					break;

				case GlobalEnum.OSUICssClassPosition.bottomRight:
					openAt = GlobalEnum.OSUICssClassPosition.topRight;

					if (out.right) {
						openAt = GlobalEnum.OSUICssClassPosition.topLeft;
					} else if (out.left) {
						openAt = GlobalEnum.OSUICssClassPosition.topRight;
					}
					break;

				case GlobalEnum.OSUICssClassPosition.bottomLeft:
					openAt = GlobalEnum.OSUICssClassPosition.topLeft;

					if (out.right) {
						openAt = GlobalEnum.OSUICssClassPosition.topLeft;
					} else if (out.left) {
						openAt = GlobalEnum.OSUICssClassPosition.topRight;
					}
					break;
			}
		}
		// Is out of Left boundary
		else if (out.left) {
			openAt = GlobalEnum.OSUICssClassPosition.right;

			switch (activePosition) {
				case GlobalEnum.OSUICssClassPosition.center:
					openAt = GlobalEnum.OSUICssClassPosition.right;
					break;

				case GlobalEnum.OSUICssClassPosition.top:
					openAt = GlobalEnum.OSUICssClassPosition.topRight;
					break;

				case GlobalEnum.OSUICssClassPosition.topLeft:
					openAt = GlobalEnum.OSUICssClassPosition.topRight;
					break;
			}
		}

		return openAt;
	}

	/**
	 * Function to be used to check the position where the given element must open if it's out of viewport or has an overflow hidden container as a parent
	 *
	 * @export
	 * @param {HTMLElement} elem Pattern element (typically _selfElem), it will be used to check for a parentNode with a overflow hidden property
	 * @param {HTMLElement} elemToTest Element that will be (or not) placed into the new position
	 * @param {HTMLElement} elemToAddCssClassPos Element where the cssClass must be managed to change (or not) the elemToTest position
	 * @return {*}  {*}
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export function CalcBounds(
		elem: HTMLElement,
		elemToTest: HTMLElement,
		elemToAddCssClassPos: HTMLElement
	): boundsReturnCalc {
		// Info that will be returned
		const _infoToReturn: boundsReturnCalc = {
			addCssClassPos: false,
			removeCssClassPos: false,
		};

		// Store the new position if it will have one
		let _newItemPosition: string | boolean = '';

		// Check if the element has already a defined class position
		const _checkIfElementPosition = Helper.Style.HasCssClassPosition(elemToAddCssClassPos);

		// Check if there are any parentNode with the overflow hidden property
		const _overflowElem = HasOverflowHiddenProp(elem.parentElement);
		if (_overflowElem) {
			// Check if the element is out of the founded parentNode view boundaries
			_newItemPosition = IsItemOutOfViewElemBounds(elemToTest, _overflowElem, _checkIfElementPosition);
		} else {
			// If there are not a parentNode with the overflow hidden, check the body boudaries
			_newItemPosition = IsItemOutOfViewElemBounds(elemToTest, document.body);
		}

		// Check if the old cssClass position must be removed!
		if (_newItemPosition && _checkIfElementPosition && _newItemPosition !== _checkIfElementPosition) {
			_infoToReturn.removeCssClassPos = _checkIfElementPosition;
		}

		// If a new position cssClass must be added
		if (_newItemPosition) {
			_infoToReturn.addCssClassPos = _newItemPosition;
		}

		return _infoToReturn;
	}
}
