// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper.Style {
	/**
	 * Method that will add a given css class to a given html element
	 *
	 * @export
	 * @param {HTMLElement} elem Element where the class will be added
	 * @param {string} cssClass Css class that will be added
	 */
	export function AddClass(elem: HTMLElement, cssClass: string): void {
		elem.classList.add(cssClass);
	}

	/**
	 * Method that will remove a given css class from a given html element
	 *
	 * @export
	 * @param {HTMLElement} elem Element where the class will be removed
	 * @param {string} cssClass Css class that will be removed
	 */
	export function RemoveClass(elem: HTMLElement, cssClass: string): void {
		elem.classList.remove(cssClass);
	}

	/**
	 * Method that will toggle a given css class from a given html element
	 *
	 * @export
	 * @param {HTMLElement} elem Element where the class will be toggled
	 * @param {string} cssClass Css class that will be toggled
	 */
	export function ToogleClass(elem: HTMLElement, cssClass: string): void {
		elem.classList.toggle(cssClass);
	}

	/**
	 * Method that will look for a cssClass Position on a given element
	 *
	 * @export
	 * @param {HTMLElement} elem Element where the cssClass will be looked for
	 * @return {*}  {(string | boolean)}
	 */
	export function HasCssClassPosition(elem: HTMLElement): string | boolean {
		const classesEnum = Object.keys(GlobalEnum.OSUICssClassPosition);
		for (let i = 0; i < classesEnum.length; ++i) {
			if (elem.classList.contains(GlobalEnum.OSUICssClassPosition[classesEnum[i]])) {
				return GlobalEnum.OSUICssClassPosition[classesEnum[i]];
			}
		}
		return false;
	}
}
