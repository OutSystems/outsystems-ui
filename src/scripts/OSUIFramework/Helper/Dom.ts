// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	/**
	 * Abstract class reponsible for manipulating attributes in dom elements.
	 *
	 * @abstract
	 * @class AttributeManipulation
	 */
	abstract class AttributeManipulation {
		/**
		 * Method that will retunr a given attribute value from a given html element.
		 *
		 * @static
		 * @param {HTMLElement} element Element where the attribute will be looked for.
		 * @param {string} attrName Attribute name to be obtained the value.
		 * @return {*}  {string}
		 * @memberof AttributeManipulation
		 */
		public static Get(element: HTMLElement, attrName: string): string {
			if (element) {
				return element.getAttribute(attrName);
			} else {
				throw Error(`The element does not exist, when trying to get the attribute '${attrName}'.`);
			}
		}

		/**
		 * Method that will remove a given attribute from a given html element
		 *
		 * @static
		 * @param {HTMLElement} element Element where the given attribute will be removed.
		 * @param {string} attrName Attribute name to be removed.
		 * @memberof AttributeManipulation
		 */
		public static Remove(element: HTMLElement, attrName: string): void {
			if (element) {
				element.removeAttribute(attrName);
			} else {
				throw Error(`The element does not exist, when trying to remove the attribute '${attrName}'.`);
			}
		}

		/**
		 * Method that will add a given attribute to a given html element.
		 *
		 * @static
		 * @param {HTMLElement} element Element where the given attribute will be added.
		 * @param {string} attrName Attribute name to be added.
		 * @param {(boolean | number | string)} attrValue Attribute value to be added.
		 * @memberof AttributeManipulation
		 */
		public static Set(element: HTMLElement, attrName: string, attrValue: boolean | number | string): void {
			if (element) {
				element.setAttribute(attrName, attrValue.toString());
			} else {
				throw Error(`The element does not exist, when trying to set the attribute '${attrName}'.`);
			}
		}
	}

	/**
	 * Abstract class reponsible for manipulating styles and classes in dom elements.
	 *
	 * @abstract
	 * @class StyleManipulation
	 */
	abstract class StyleManipulation {
		/**
		 * Method that will add a given css class to a given html element.
		 *
		 * @static
		 * @param {HTMLElement} element Element where the class will be added.
		 * @param {string} cssClass Css class that will be added.
		 * @memberof StyleManipulation
		 */
		public static AddClass(element: HTMLElement, cssClass: string): void {
			if (element) {
				element.classList.add(cssClass);
			} else {
				throw Error(`The element does not exist, when trying to add the class '${cssClass}'.`);
			}
		}

		/**
		 * Method that will check a given css class on a given html element.
		 *
		 * @static
		 * @param {HTMLElement} element Element that will be checked for the class.
		 * @param {string} cssClass Css class that will be checked.
		 * @return {*}  {boolean} true if the element possess the class.
		 * @memberof StyleManipulation
		 */
		public static ContainsClass(element: HTMLElement, cssClass: string): boolean {
			if (element) {
				return element.classList.contains(cssClass);
			} else {
				throw Error(`The element does not exist, when trying to check if it has the class '${cssClass}'.`);
			}
		}

		/**
		 * Method that will look for a cssClass Position on a given element.
		 *
		 * @static
		 * @param {HTMLElement} element Element where the cssClass will be looked for.
		 * @return {*}  {string} returns the class name that represents the position. In case there no position class defined, return undefined.
		 * @memberof StyleManipulation
		 */
		public static HasCssClassPosition(element: HTMLElement): string | undefined {
			if (element) {
				const classesEnum = Object.keys(GlobalEnum.CssClassPosition);
				for (const positionClass in classesEnum) {
					if (StyleManipulation.ContainsClass(element, GlobalEnum.CssClassPosition[positionClass])) {
						return GlobalEnum.CssClassPosition[positionClass];
					}
				}
				return undefined;
			} else {
				throw Error('The element does not exist, when trying to check for position class.');
			}
		}

		/**
		 * Method that will remove a given css class from a given html element.
		 *
		 * @static
		 * @param {HTMLElement} element Element where the class will be removed.
		 * @param {string} cssClass Css class that will be removed.
		 * @memberof StyleManipulation
		 */
		public static RemoveClass(element: HTMLElement, cssClass: string): void {
			if (element) {
				element.classList.remove(cssClass);
			} else {
				throw Error(`The element does not exist, when trying to remove the class '${cssClass}'.`);
			}
		}

		/**
		 * Method that add a style attribute to a given html element.
		 *
		 * @static
		 * @param {HTMLElement} element Element where the class will be toggled.
		 * @param {string} cssRule Css rule that will be added.
		 * @param {(number | string)} ruleValue Value of the CSS rule.
		 * @memberof StyleManipulation
		 */
		public static SetStyleAttribute(element: HTMLElement, cssRule: string, ruleValue: number | string): void {
			if (element) {
				element.style.setProperty(cssRule, ruleValue.toString());
			} else {
				throw Error(`The element does not exist, when trying to apply the rule '${cssRule}'.`);
			}
		}

		/**
		 * Method that will toggle a given css class from a given html element.
		 *
		 * @static
		 * @param {HTMLElement} element Element where the class will be toggled.
		 * @param {string} cssClass Css class that will be toggled.
		 * @memberof StyleManipulation
		 */
		public static ToggleClass(element: HTMLElement, cssClass: string): void {
			if (element) {
				element.classList.toggle(cssClass);
			} else {
				throw Error(`The element does not exist, when trying to toggle the class '${cssClass}'.`);
			}
		}
	}

	export abstract class Dom {
		/**
		 * Getter of the class that helps to manipulate the HTML attributes.
		 *
		 * @readonly
		 * @static
		 * @type {typeof AttributeManipulation}
		 * @memberof Dom
		 */
		public static get Attribute(): typeof AttributeManipulation {
			return AttributeManipulation;
		}

		/**
		 * Getter of the class that helps to manipulate the HTML styles and classes.
		 *
		 * @readonly
		 * @static
		 * @type {typeof StyleManipulation}
		 * @memberof Dom
		 */
		public static get Styles(): typeof StyleManipulation {
			return StyleManipulation;
		}

		/**
		 * Function that performs a querySelector of a given class in a given element.
		 *
		 * @static
		 * @param {HTMLElement} element Element to be queried.
		 * @param {string} cssClass CSS class to test its value.
		 * @return {*}  {(HTMLElement | undefined)} Return the HTMLElement found, of if not undefined.
		 * @memberof Dom
		 */
		public static ClassSelector(element: HTMLElement, cssClass: string): HTMLElement | undefined {
			let elementFound: HTMLElement = undefined;

			if (element) {
				elementFound = element.querySelector(Constants.Dot + cssClass);
				//this is to make sure that we are only returning the element or undefined.
				elementFound = elementFound ? elementFound : undefined;
			} else {
				console.error(`The element doesnot exist.`);
			}

			return elementFound;
		}

		/**
		 * Responsable for finding a DOM Element by its name attribute.
		 * That is commonly used to store the uniqueID generated by the framework.
		 *
		 * @static
		 * @param {string} uniqueId uniqueId generated by the framework.
		 * @return {*}  {HTMLElement} The respective DOM Element.
		 * @memberof Dom
		 */
		public static GetElementByUniqueId(uniqueId: string): HTMLElement {
			const obj = document.getElementsByName(uniqueId);

			if (obj.length) {
				return obj[0];
			} else {
				throw new Error(`Object with name '${uniqueId}' not found.`);
			}
		}

		/**
		 * Moves a given HTML element to target position.
		 *
		 * @static
		 * @param {HTMLElement} element Element to be moved.
		 * @param {HTMLElement} target Location to where the Element is to be moved.
		 * @memberof Dom
		 */
		public static Move(element: HTMLElement, target: HTMLElement): void {
			if (element && target) {
				target.appendChild(element);
			}
		}

		/**
		 * Function that performs a querySelector of a given html tag in a given element.
		 *
		 * @static
		 * @param {HTMLElement} element Element to be queried.
		 * @param {string} htmlTag HTML elementto be searched for.
		 * @return {*}  {(HTMLElement | undefined)}
		 * @memberof Dom
		 */
		public static TagSelector(element: HTMLElement, htmlTag: string): HTMLElement | undefined {
			let elementFound: HTMLElement = undefined;

			if (element) {
				elementFound = element.querySelector(htmlTag);
				//this is to make sure that we are only returning the element or undefined.
				elementFound = elementFound ? elementFound : undefined;
			} else {
				console.error(`The element doesnot exist.`);
			}

			return elementFound;
		}
	}
}
