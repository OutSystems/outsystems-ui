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
	 * Method that will look for a cssClass based on a given cssClasses Array values
	 *
	 * @export
	 * @param {HTMLElement} elem Element where the Array cssClasses values will be looked for
	 * @param {any[]} cssClasses Array values to be looked for as a cssClass into the given element
	 * @return {*}  {(string | boolean)}
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export function HasCssClassFromEnum(elem: HTMLElement, cssClasses: any[]): string | boolean {
		for (let i = 0; i < cssClasses.length; ++i) {
			if (
				GlobalEnum.OSUICssClassPosition.hasOwnProperty(cssClasses[i]) &&
				elem.classList.contains(GlobalEnum.OSUICssClassPosition[cssClasses[i]])
			) {
				return GlobalEnum.OSUICssClassPosition[cssClasses[i]];
			}
		}
		return false;
	}
}
