// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Helper {
	export abstract class InvalidInputs {
		// Method to check if exists invalid inputs
		private static _checkInvalidInputs(element: HTMLElement, isSmooth: boolean, elementParentClass: string): void {
			const notValidClassess = [
				Constants.Dot + GlobalEnum.CssClassElements.InputNotValid,
				Constants.Dot + Providers.OSUI.Datepicker.Flatpickr.Enum.CSSSelectors.DatepickerNotValid,
				Constants.Dot + Patterns.Dropdown.ServerSide.Enum.CssClass.NotValid,
				Constants.Dot + Providers.OSUI.Dropdown.VirtualSelect.Enum.CssClass.NotValid,
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
					this._scrollToInvalidInput(invalidInput, isSmooth, elementParentClass);
				} else {
					// Check if closest element contains ID
					Helper.AsyncInvocation(() => {
						this._searchElementId(invalidInput, isSmooth, elementParentClass);
					});
				}
			}
		}

		// Method to call Utils API > ScrollToElement
		private static _scrollToInvalidInput(
			element: HTMLElement,
			isSmooth: boolean,
			elementParentClass: string
		): void {
			const browser = OSFramework.OSUI.Helper.DeviceInfo.GetBrowser();

			OutSystems.OSUI.Utils.ScrollToElement(element.id, isSmooth, 0, elementParentClass);

			// Set the element focus directly because the event scrollend isn't supported by safari or iOS
			if (browser === GlobalEnum.Browser.safari || OSFramework.OSUI.Helper.DeviceInfo.IsIos) {
				element.focus();
			} else {
				// Set the scrollable element to add the ScrollEnd event
				const activeScreenElement = Helper.Dom.ClassSelector(
					document.body,
					GlobalEnum.CssClassElements.ActiveScreen
				);

				// Set the temporary function for event of ScrollEnd, to focus on element after the scroll occur
				const focusOnScrollEnd = () => {
					element.focus();
					activeScreenElement.removeEventListener(GlobalEnum.HTMLEvent.ScrollEnd, focusOnScrollEnd);
				};

				// Add event on scrollable element, to focus on target element
				activeScreenElement.addEventListener(GlobalEnum.HTMLEvent.ScrollEnd, focusOnScrollEnd);
			}
		}

		// Method that will search for the closest element with ID
		private static _searchElementId(element: HTMLElement, isSmooth: boolean, elementParentClass: string): void {
			const elementToSearch = element.parentElement;
			if (elementToSearch.id !== Constants.EmptyString) {
				this._scrollToInvalidInput(elementToSearch, isSmooth, elementParentClass);
			} else {
				this._searchElementId(elementToSearch, isSmooth, elementParentClass);
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
		public static FocusFirstInvalidInput(elementId: string, isSmooth: boolean, elementParentClass: string): string {
			const result = OutSystems.OSUI.Utils.CreateApiResponse({
				errorCode: OutSystems.OSUI.ErrorCodes.Utilities.FailGetInvalidInput,
				callback: () => {
					let element: HTMLElement = document.body;

					if (elementId !== Constants.EmptyString) {
						element = Helper.Dom.GetElementById(elementId);
					}

					// Wait for platform to add invalid classes
					Helper.AsyncInvocation(() => {
						this._checkInvalidInputs(element, isSmooth, elementParentClass);
					});
				},
			});

			return result;
		}
	}
}
