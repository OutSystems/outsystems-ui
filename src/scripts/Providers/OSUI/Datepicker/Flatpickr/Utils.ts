// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Datepicker.Flatpickr.Utils {
	/**
	 * Function to help get the element for the extensibility positionElement option
	 *
	 * @export
	 * @param {string} elementId
	 * @return {*}  {HTMLElement}
	 */
	export function GetPositionElement(elementId: string): HTMLElement {
		const _positionElement = document.getElementById(elementId);

		if (!_positionElement) {
			console.warn(`It was not possible to find an element with the id: ${elementId}`);
		}

		return _positionElement;
	}
}
