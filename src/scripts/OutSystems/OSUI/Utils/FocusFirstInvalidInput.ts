/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Utils.InvalidInputs {
	/**
	 * Used to trigger the OSFramework.OSUI method responsible for set the FocusFirstInvalidInput
	 *
	 * @export
	 * @param {string} elementId
	 * @param {boolean} isSmooth
	 */
	export function FocusFirstInvalidInput(elementId: string, isSmooth: boolean, elementParentClass: string): string {
		return OSFramework.OSUI.Helper.InvalidInputs.FocusFirstInvalidInput(elementId, isSmooth, elementParentClass);
	}
}
