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
		if (elem) {
			elem.classList.add(cssClass);
		} else {
			throw Error(`The element does not exist, when trying to add the class '${cssClass}'.`);
		}
	}

	/**
	 * Method that will check a given css class on a given html element
	 *
	 * @export
	 * @param {HTMLElement} elem
	 * @param {string} cssClass
	 * @return {*}  {boolean}
	 */
	export function ContainsClass(elem: HTMLElement, cssClass: string): boolean {
		if (elem) {
			return elem.classList.contains(cssClass);
		} else {
			throw Error(`The element does not exist, when trying to check if it has the class '${cssClass}'.`);
		}
	}

	/**
	 * Method used to get the color value based on color entity given color name
	 *
	 * @param colorName
	 * @returns
	 */
	export function GetColorValueFromColorType(colorName: string): string {
		return getComputedStyle(document.documentElement).getPropertyValue('--color-' + colorName);
	}

	/**
	 * Method that will look for a cssClass Position on a given element
	 *
	 * @param elem elem Element where the cssClass will be looked for
	 * @returns
	 */
	export function HasCssClassPosition(elem: HTMLElement): string {
		if (elem) {
			const classesEnum = Object.keys(GlobalEnum.OSUICssClassPosition);
			for (let i = 0; i < classesEnum.length; ++i) {
				if (elem.classList.contains(GlobalEnum.OSUICssClassPosition[classesEnum[i]])) {
					return GlobalEnum.OSUICssClassPosition[classesEnum[i]];
				}
			}
			return null;
		} else {
			throw Error('The element does not exist, when trying to check for position class.');
		}
	}

	/**
	 * Method that will remove a given css class from a given html element
	 *
	 * @export
	 * @param {HTMLElement} elem Element where the class will be removed
	 * @param {string} cssClass Css class that will be removed
	 */
	export function RemoveClass(elem: HTMLElement, cssClass: string): void {
		if (elem) {
			elem.classList.remove(cssClass);
		} else {
			throw Error(`The element does not exist, when trying to remove the class '${cssClass}'.`);
		}
	}

	/**
	 * Method that add a style attribute to a given html element
	 *
	 * @export
	 * @param {HTMLElement} elem Element where the class will be toggled
	 * @param {string} cssRule Css rule that will be added
	 * @param {string} ruleValue Value of the CSS rule
	 */
	export function SetStyleAttribute(elem: HTMLElement, cssRule: string, ruleValue: number | string): void {
		if (elem) {
			elem.style.setProperty(cssRule, ruleValue.toString());
		} else {
			throw Error(`The element does not exist, when trying to apply the rule '${cssRule}'.`);
		}
	}

	/**
	 * Method that will toggle a given css class from a given html element
	 *
	 * @export
	 * @param {HTMLElement} elem Element where the class will be toggled
	 * @param {string} cssClass Css class that will be toggled
	 */
	export function ToggleClass(elem: HTMLElement, cssClass: string): void {
		if (elem) {
			elem.classList.toggle(cssClass);
		} else {
			throw Error(`The element does not exist, when trying to toggle the class '${cssClass}'.`);
		}
	}
}
