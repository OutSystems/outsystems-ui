// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Helper {
	export abstract class InvalidInputs {
		private static _checkInvalidInputs(element: HTMLElement, isSmooth: boolean): void {
			const notValidClassess = [
				GlobalEnum.CssClassElements.PlatformNotValid,
				Patterns.Dropdown.ServerSide.Enum.CssClass.NotValid,
				Providers.Dropdown.VirtualSelect.Enum.CssClass.NotValid,
			];

			// Method to check if exists invalid inputs
			for (const className of notValidClassess) {
				const invalidInput = Helper.Dom.ClassSelector(element, className);

				if (invalidInput) {
					// If True, call scroll to element method to given element
					OutSystems.OSUI.Utils.ScrollToElement(invalidInput.id, isSmooth);
					break;
				}
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
		public static FocusFirstInvalidInput(elementId: string, isSmooth: boolean): string {
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

				this._checkInvalidInputs(element, isSmooth);
			} catch (error) {
				responseObj.isSuccess = false;
				responseObj.message = error.message;
				responseObj.code = OutSystems.OSUI.ErrorCodes.InvalidInput.FailGetInvalidInput;
			}

			return JSON.stringify(responseObj);
		}
	}
}
