/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Utils.InvalidInputs {
	/**
	 * Used to trigger the OSFramework.OSUI method responsible for set the FocusFirstInvalidInput
	 *
	 * @param elementId Id of the element that wraps the inputs
	 * @param isSmooth True to scroll smoothly to the input
	 * @param elementParentClass Class of the scrollable parent, used to compute the scroll offset
	 */
	export function FocusFirstInvalidInput(elementId: string, isSmooth: boolean, elementParentClass: string): string {
		return OSFramework.OSUI.Helper.InvalidInputs.FocusFirstInvalidInput(elementId, isSmooth, elementParentClass);
	}
}
