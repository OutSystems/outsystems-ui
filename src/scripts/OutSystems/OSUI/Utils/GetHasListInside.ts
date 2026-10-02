// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * Method that returns if the target has a list widget inside
	 *
	 * @param targetElem
	 */
	export function GetHasListInside(targetElem: HTMLElement): boolean {
		const listElements = OSUI.Utils.ChildrenMatches(
			targetElem,
			OSFramework.OSUI.Constants.Dot + OSFramework.OSUI.GlobalEnum.CssClassElements.List
		);

		return listElements.length > 0;
	}
}
