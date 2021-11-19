// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	abstract class AttributeManipulation {
		/**
		 * Method that will retunr a given attribute value from a given html element
		 *
		 * @export
		 * @param {HTMLElement} elem Element where the attribute will be looked for
		 * @param {string} attrName Attribute name
		 */
		public static Get(elem: HTMLElement, attrName: string): string {
			if (elem) {
				return elem.getAttribute(attrName);
			} else {
				throw Error(`The element does not exist, when trying to get the attribute '${attrName}'.`);
			}
		}

		/**
		 * Method that will remove a given attribute from a given html element
		 *
		 * @export
		 * @param {HTMLElement} elem Element where the given attribute will be removed
		 * @param {string} attrName Attribute name
		 */
		public static Remove(elem: HTMLElement, attrName: string): void {
			if (elem) {
				elem.removeAttribute(attrName);
			} else {
				throw Error(`The element does not exist, when trying to remove the attribute '${attrName}'.`);
			}
		}

		/**
		 * Method that will add a given attribute to a given html element
		 *
		 * @export
		 * @param {HTMLElement} elem Element where the given attribute will be added
		 * @param {string} attrName Attribute name
		 * @param {string} attrValue Attribute value
		 */
		public static Set(elem: HTMLElement, attrName: string, attrValue: string | boolean): void {
			if (elem) {
				elem.setAttribute(attrName, attrValue.toString());
			} else {
				throw Error(`The element does not exist, when trying to set the attribute '${attrName}'.`);
			}
		}
	}

	abstract class StyleManipulation {
		/**
		 * Method that will add a given css class to a given html element
		 *
		 * @export
		 * @param {HTMLElement} elem Element where the class will be added
		 * @param {string} cssClass Css class that will be added
		 */
		public static AddClass(elem: HTMLElement, cssClass: string): void {
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
		public static ContainsClass(elem: HTMLElement, cssClass: string): boolean {
			if (elem) {
				return elem.classList.contains(cssClass);
			} else {
				throw Error(`The element does not exist, when trying to check if it has the class '${cssClass}'.`);
			}
		}
		/**
		 * Method used to get the border radius value based on shape entity
		 *
		 * @param shapeName
		 * @returns
		 */
		public static GetBorderRadiusValueFromShapeType(shapeName: string): string {
			return getComputedStyle(document.documentElement).getPropertyValue('--border-radius-' + shapeName);
		}

		/**
		 * Method used to get the color value based on color entity given color name
		 *
		 * @param colorName
		 * @returns
		 */
		public static GetColorValueFromColorType(colorName: string): string {
			return getComputedStyle(document.documentElement).getPropertyValue('--color-' + colorName);
		}

		/**
		 * Method that will look for a cssClass Position on a given element
		 *
		 * @param elem elem Element where the cssClass will be looked for
		 * @returns
		 */
		public static HasCssClassPosition(elem: HTMLElement): string {
			if (elem) {
				const classesEnum = Object.keys(GlobalEnum.CssClassPosition);
				for (let i = 0; i < classesEnum.length; ++i) {
					if (elem.classList.contains(GlobalEnum.CssClassPosition[classesEnum[i]])) {
						return GlobalEnum.CssClassPosition[classesEnum[i]];
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
		public static RemoveClass(elem: HTMLElement, cssClass: string): void {
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
		public static SetStyleAttribute(elem: HTMLElement, cssRule: string, ruleValue: number | string): void {
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
		public static ToggleClass(elem: HTMLElement, cssClass: string): void {
			if (elem) {
				elem.classList.toggle(cssClass);
			} else {
				throw Error(`The element does not exist, when trying to toggle the class '${cssClass}'.`);
			}
		}
	}

	export abstract class DomManipulation {
		public static get Attribute(): typeof AttributeManipulation {
			return AttributeManipulation;
		}

		public static get Styles(): typeof StyleManipulation {
			return StyleManipulation;
		}

		/**
		 * Responsable for finding a DOM Element
		 * @param uniqueId Identificator for a HTMElement
		 * @param raiseError Will throw when there is no object with this uniqueId
		 * @returns The respective DOM Element
		 */
		public static GetElementByUniqueId(uniqueId: string): HTMLElement {
			const obj = document.getElementsByName(uniqueId);

			if (obj.length) {
				return obj[0];
			} else {
				throw new Error(`Object with name '${uniqueId}' not found.`);
			}
		}

		// Move element to target position
		public static Move(element: HTMLElement, target: HTMLElement): void {
			if (element && target) {
				target.appendChild(element);
			}
		}
	}
}
