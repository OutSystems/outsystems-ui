// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Helper {
	export abstract class InvalidInputs {
		// Method to check if exists invalid inputs
		private static _checkInvalidInputs(element: HTMLElement, isSmooth: boolean, scrollableElement: string): void {
			const notValidClassess = [
				Constants.Dot + GlobalEnum.CssClassElements.InputNotValid,
				Constants.Dot + Providers.Datepicker.Flatpickr.Enum.CSSSelectors.DatepickerNotValid,
				Constants.Dot + Patterns.Dropdown.ServerSide.Enum.CssClass.NotValid,
				Constants.Dot + Providers.Dropdown.VirtualSelect.Enum.CssClass.NotValid,
			];
			// Arrange the class names list for selector
			const joinClassNames = [notValidClassess].join(Constants.Comma);
			// Get the first invalid input element
			const invalidInput = element.querySelectorAll(joinClassNames)[0] as HTMLElement;

			// Check if exists a invalid input, based on provided class
			if (invalidInput) {
				const inputVisible = window.getComputedStyle(invalidInput).display !== GlobalEnum.CssProperties.None;

				// Check if element exists and is visible on DOM
				if (inputVisible) {
					// If True, call scroll to element method to given element
					this._scrollToInvalidInput(invalidInput, isSmooth, scrollableElement);
				} else {
					// Check if closest element contains ID
					Helper.AsyncInvocation(() => {
						this._searchElementId(invalidInput, isSmooth, scrollableElement);
					});
				}
			}
		}

		// Method to call Utils API > ScrollToElement
		private static _scrollToInvalidInput(element: HTMLElement, isSmooth: boolean, scrollableElement: string): void {
			OutSystems.OSUI.Utils.ScrollToElement(element.id, isSmooth, 0, scrollableElement);
		}

		// Method that will search for the closest element with ID
		private static _searchElementId(element: HTMLElement, isSmooth: boolean, scrollableElement: string): void {
			const elementToSearch = element.parentElement;
			if (elementToSearch.id !== '') {
				this._scrollToInvalidInput(elementToSearch, isSmooth, scrollableElement);
			} else {
				this._searchElementId(elementToSearch, isSmooth, scrollableElement);
			}
		}

		/**
		 *  Function used to check if an element, body or elementId, contains invalid inputs
		 *
		 * @static
		 * @param {string} elementId
		 * @param {boolean} isSmooth
		 * @return {*}  {string}
		 * @memberof InvalidInputs
		 */
		public static FocusFirstInvalidInput(elementId: string, isSmooth: boolean, scrollableElement: string): string {
			let element: HTMLElement = document.body;
			const responseObj = {
				isSuccess: true,
				message: OutSystems.OSUI.ErrorCodes.Success.message,
				code: OutSystems.OSUI.ErrorCodes.Success.code,
			};

			try {
				if (elementId !== '') {
					element = Helper.Dom.GetElementById(elementId);
				}

				this._checkInvalidInputs(element, isSmooth, scrollableElement);
			} catch (error) {
				responseObj.isSuccess = false;
				responseObj.message = error.message;
				responseObj.code = OutSystems.OSUI.ErrorCodes.InvalidInput.FailGetInvalidInput;
			}

			return JSON.stringify(responseObj);
		}
	}
}
