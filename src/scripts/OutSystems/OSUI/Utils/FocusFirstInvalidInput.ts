/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Utils.InvalidInputs {
	/**
	 * Used to trigger the OSFramework method responsible for set the FocusFirstInvalidInput
	 *
	 * @export
	 * @param {string} elementId
	 * @param {boolean} isSmooth
	 */
	export function FocusFirstInvalidInput(elementId: string, isSmooth: boolean, scrollableElement: string): string {
		return OSFramework.Helper.InvalidInputs.FocusFirstInvalidInput(elementId, isSmooth, scrollableElement);
	}
}
