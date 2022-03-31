// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * Method that returns if the target has a list widget inside
	 *
	 * @export
	 * @param {HTMLElement} targetElem
	 * @return {*}  {boolean}
	 */
	export function GetHasListInside(targetElem: HTMLElement): boolean {
		const listElements = OSUI.Utils.ChildrenMatches(
			targetElem,
			OSUIFramework.Constants.Dot + OSUIFramework.GlobalEnum.CssClassElements.List
		);

		return listElements.length > 0;
	}
}
