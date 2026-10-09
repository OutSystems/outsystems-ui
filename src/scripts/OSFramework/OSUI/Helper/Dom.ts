// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Helper {
	/**
	 * Abstract class reponsible for manipulating attributes in dom elements.
	 *
	 * @abstract
	 */
	abstract class AttributeManipulation {
		/**
		 * Method that will return a given attribute value from a given html element.
		 *
		 * @param element Element where the attribute will be looked for.
		 * @param attrName Attribute name to be obtained the value.
		 */
		public static Get(element: HTMLElement, attrName: string): string | undefined {
			if (element) {
				const value = element.getAttribute(attrName);
				return value ? value : undefined;
			} else {
				throw Error(`The element does not exist, when trying to get the attribute '${attrName}'.`);
			}
		}

		/**
		 * Method that will check if a given attribute exists for the given html element.
		 *
		 * @param element Element to inspect or update
		 * @param attrName Name of the attribute
		 */
		public static Has(element: HTMLElement, attrName: string): boolean {
			if (element) {
				return element.hasAttribute(attrName);
			} else {
				throw Error(`The element does not exist, when trying to check the attribute '${attrName}'.`);
			}
		}

		/**
		 * Method that will return the Id of the html element.
		 *
		 * @param element Element to inspect or update
		 */
		public static Id(element: HTMLElement): string | undefined {
			return AttributeManipulation.Get(element, 'Id');
		}

		/**
		 * Method that will remove a given attribute from a given html element
		 *
		 * @param element Element where the given attribute will be removed.
		 * @param attrName Attribute name to be removed.
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
		 * @param element Element where the given attribute will be added.
		 * @param attrName Attribute name to be added.
		 * @param attrValue Attribute value to be added.
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
	 */
	abstract class StyleManipulation {
		/**
		 * Method that will add a given css class to a given html element.
		 *
		 * @param element Element where the class will be added.
		 * @param cssClass Css class that will be added.
		 */
		public static AddClass(element: HTMLElement, cssClass: string): void {
			if (element) {
				if (cssClass !== '') {
					element.classList.add(cssClass);
				}
			} else {
				throw Error(`The element does not exist, when trying to add the class '${cssClass}'.`);
			}
		}

		/**
		 * Method that will check a given css class on a given html element.
		 *
		 * @param element Element that will be checked for the class.
		 * @param cssClass Css class that will be checked.
		 * @returns true if the element possess the class.
		 */
		public static ContainsClass(element: HTMLElement, cssClass: string): boolean {
			if (element) {
				if (cssClass !== '') {
					return element.classList.contains(cssClass);
				}
			} else {
				throw Error(`The element does not exist, when trying to check if it has the class '${cssClass}'.`);
			}
		}

		/**
		 * Method that knows how to update the Extended class of the pattern.
		 *
		 * @param element Element where the class will be toggled.
		 * @param currentCssClasses Css classes that are assigned to the given element
		 * @param newCssClass Css classes that will be assigned to the given element
		 */
		public static ExtendedClass(element: HTMLElement, currentCssClasses: string, newCssClass: string): void {
			if (element) {
				const currentClassesList = currentCssClasses.split(' ');
				const newClassesList = newCssClass.split(' ');
				let classesToRemove = [];
				let classesToAdd = [];

				if (currentCssClasses !== '') {
					classesToRemove = currentClassesList.filter(
						(currClass) => newClassesList.indexOf(currClass) === -1
					);
				}

				if (newCssClass !== '') {
					classesToAdd = newClassesList.filter((newClass) => currentClassesList.indexOf(newClass) === -1);
				}

				//Let's remove only the classes that are to do so.
				if (classesToRemove.length > 0) {
					classesToRemove.forEach((classToRemove) => {
						Helper.Dom.Styles.RemoveClass(element, classToRemove);
					});
				}

				//Let's add only the new classes
				if (classesToAdd.length > 0) {
					classesToAdd.forEach((classToAdd) => {
						Helper.Dom.Styles.AddClass(element, classToAdd);
					});
				}
			} else {
				throw Error(`The element does not exist, when trying to update EntendedClass '${newCssClass}'.`);
			}
		}

		/**
		 * Method used to get the border radius value based on shape entity
		 *
		 * @param shapeName Name of the shape type
		 */
		public static GetBorderRadiusValueFromShapeType(shapeName: string): string {
			return getComputedStyle(document.documentElement).getPropertyValue('--border-radius-' + shapeName);
		}

		/**
		 * Method used to get the color value based on color entity given color name or on a value provided from user (HEX or RGB)
		 *
		 * @param colorName Name of the colour type
		 */
		public static GetColorValueFromColorType(colorName: string): string {
			// Store the color value based on the CSS variable color
			const colorValue = getComputedStyle(document.documentElement).getPropertyValue('--color-' + colorName);

			// Check if the value isn't empty because of HEX or RGB values
			if (colorValue !== '') {
				return colorValue;
			}

			return colorName;
		}

		/**
		 * Returns the CSS classes that a a given element has
		 *
		 * @param element Element to inspect or update
		 */
		public static GetCssClasses(element: HTMLElement): Set<string> {
			if (element) {
				return new Set([...element.classList]);
			} else {
				throw Error('The element does not exist, when trying to get the classes.');
			}
		}

		/**
		 * Returns the value of a CSS Custom Property
		 *
		 * @param element Element to inspect or update
		 * @param propertyName Name of the CSS custom property
		 */
		public static GetCustomProperty(element: HTMLElement, propertyName: string) {
			if (element) {
				return getComputedStyle(element).getPropertyValue(propertyName);
			} else {
				throw Error(`The element does not exist, when trying to get the Custom Property '${propertyName}'.`);
			}
		}

		/**
		 * Method that will remove a given css class from a given html element.
		 *
		 * @param element Element where the class will be removed.
		 * @param cssClass Css class that will be removed.
		 */
		public static RemoveClass(element: HTMLElement, cssClass: string): void {
			if (element) {
				if (cssClass !== '') {
					element.classList.remove(cssClass);
				}
			} else {
				throw Error(`The element does not exist, when trying to remove the class '${cssClass}'.`);
			}
		}

		/**
		 * Method that remove a style attribute to a given html element.
		 *
		 * @param element Element where the class will be toggled.
		 * @param cssProperty Css property that will be removed.
		 */
		public static RemoveStyleAttribute(element: HTMLElement, cssProperty: string): void {
			if (element) {
				if (cssProperty !== '') {
					element.style.removeProperty(cssProperty);
				}
			} else {
				throw Error(`The element does not exist, when trying to remove the rule '${cssProperty}'.`);
			}
		}

		/**
		 * Method that add a style attribute to a given html element.
		 *
		 * @param element Element where the class will be toggled.
		 * @param cssProperty Css property that will be added.
		 * @param ruleValue Value of the CSS property.
		 */
		public static SetStyleAttribute(element: HTMLElement, cssProperty: string, ruleValue: number | string): void {
			if (element) {
				if (cssProperty !== '' && ruleValue !== undefined) {
					element.style.setProperty(cssProperty, ruleValue.toString());
				}
			} else {
				throw Error(`The element does not exist, when trying to apply the rule '${cssProperty}'.`);
			}
		}

		/**
		 * Method that will toggle a given css class from a given html element.
		 *
		 * @param element Element where the class will be toggled.
		 * @param cssClass Css class that will be toggled.
		 */
		public static ToggleClass(element: HTMLElement, cssClass: string): void {
			if (element) {
				if (cssClass !== '') {
					element.classList.toggle(cssClass);
				}
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
		 */
		public static get Attribute(): typeof AttributeManipulation {
			return AttributeManipulation;
		}

		/**
		 * Getter of the class that helps to manipulate the HTML styles and classes.
		 *
		 * @readonly
		 */
		public static get Styles(): typeof StyleManipulation {
			return StyleManipulation;
		}

		/**
		 * Function that performs a querySelector of a given class in a given element.
		 *
		 * @param element Element to be queried.
		 * @param cssClass CSS class to test its value.
		 * @returns Return the HTMLElement found, of if not undefined.
		 */
		public static ClassSelector(element: HTMLElement | Document, cssClass: string): HTMLElement | undefined {
			let elementFound: HTMLElement = undefined;

			if (element) {
				if (cssClass !== '') {
					elementFound = element.querySelector(Constants.Dot + cssClass);
				}
				//this is to make sure that we are only returning the element or undefined.
				elementFound = elementFound ? elementFound : undefined;
			} else {
				console.error(`The element does not exist.`);
			}

			return elementFound;
		}

		/**
		 * Method that makes disables a given element.
		 *
		 * @param element Element to inspect or update
		 */
		public static Disable(element: HTMLElement): void {
			if (element) {
				if (Dom.Attribute.Has(element, 'disabled') === false) {
					Dom.Attribute.Set(element, 'disabled', true);
				}
			}
		}

		/**
		 * Method that enables a given element.
		 *
		 * @param element Element to inspect or update
		 */
		public static Enable(element: HTMLElement): void {
			if (element) {
				if (Dom.Attribute.Has(element, 'disabled')) {
					Dom.Attribute.Remove(element, 'disabled');
				}
			}
		}

		/**
		 * Generate a Random String that could be assigned as a pattern UniqueId
		 */
		public static GenerateUniqueId(): string {
			return Math.random().toString(36);
		}

		/**
		 * Responsable for finding a DOM Element by its Id.
		 *
		 * @param id Id of the element to be returned.
		 * @returns The respective DOM Element.
		 */
		public static GetElementById(id: string): HTMLElement {
			const obj = document.getElementById(id);

			if (obj) {
				return obj;
			} else {
				throw new Error(`Object with Id '${id}' not found.`);
			}
		}

		/**
		 * Responsable for finding a DOM Element by its name attribute.
		 * That is commonly used to store the uniqueID generated by the framework.
		 *
		 * @param uniqueId uniqueId generated by the framework.
		 * @returns The respective DOM Element.
		 */
		public static GetElementByUniqueId(uniqueId: string): HTMLElement {
			const obj = document.getElementsByName(uniqueId);

			if (obj.length && uniqueId !== '') {
				return obj[0];
			} else {
				throw new Error(`Object with name '${uniqueId}' not found.`);
			}
		}

		/**
		 * Method to get the list of focusable elements
		 *
		 * @param element Element to be queried.
		 * @param [includeTabIndexHidden=false] Include elements with tabindex -1
		 * @returns List of focusable elements
		 */
		public static GetFocusableElements(element: HTMLElement, includeTabIndexHidden = false): HTMLElement[] {
			const _focusableElems = element.querySelectorAll(
				`${Constants.FocusableElems}${includeTabIndexHidden ? ', ' + Constants.FocusableTabIndexHidden : ''}`
			);
			// Remove any element that has the focus-trap-ignore attribute
			const _filteredElements = Array.from(_focusableElems).filter(
				(element) => element.getAttribute(Constants.FocusTrapIgnoreAttr) !== 'true'
			);
			return [..._filteredElements] as HTMLElement[];
		}

		/**
		 * Method to check if element is inside a Popup widget
		 *
		 * @param element Element to inspect or update
		 */
		public static IsInsidePopupWidget(element: HTMLElement): boolean {
			const _popup = document.querySelectorAll(Constants.Dot + GlobalEnum.CssClassElements.Popup);
			let _isInsidePopup = false;

			if (_popup.length > 0 && element) {
				_popup.forEach((popup) => {
					if (popup.contains(element)) {
						_isInsidePopup = true;
					}
				});
			}

			return _isInsidePopup;
		}

		/**
		 * Moves a given HTML element to target position.
		 *
		 * @param element Element to be moved.
		 * @param target Location to where the Element is to be moved.
		 */
		public static Move(element: HTMLElement, target: HTMLElement): void {
			if (element && target) {
				target.appendChild(element);
			}
		}

		/**
		 * Method that will help on setting the value of an input and trigger that change to the platform in order to update it's assigned variable, otherwise platform value do not get updated if/when only a value attribute get set!
		 *
		 * @param inputElem Element where the value will be assigned!
		 * @param value Value to be assigned
		 */
		public static SetInputValue(
			inputElem: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
			value: string
		): void {
			// Set the input prototype object;
			const inputElemProtoObj = Object.getPrototypeOf(inputElem);
			// Get the Set Method for the value attribute
			const setValue = Object.getOwnPropertyDescriptor(inputElemProtoObj, 'value').set;
			// Trigger the call of the Set method in order chanhe it's value
			setValue.call(inputElem, value);
			// Trigger the CustomEvent in order trigger the update platform variable accordingly
			inputElem.dispatchEvent(new CustomEvent('input', { bubbles: true }));
		}

		/**
		 * Function that performs a querySelector of a given html tag in a given element.
		 *
		 * @param element Element to be queried.
		 * @param htmlTag HTML element to be searched for.
		 */
		public static TagSelector(element: HTMLElement, htmlTag: string): HTMLElement | undefined {
			let elementFound: HTMLElement = undefined;

			if (element) {
				if (htmlTag !== '') {
					elementFound = element.querySelector(htmlTag);
				}
				//this is to make sure that we are only returning the element or undefined.
				elementFound = elementFound ? elementFound : undefined;
			} else {
				console.error(`The element does not exist.`);
			}

			return elementFound;
		}

		/**
		 * Function that performs a querySelectorAll of a given html tag in a given element.
		 *
		 * @param element Element to be queried.
		 * @param htmlTag HTML element to be searched for.
		 */
		public static TagSelectorAll(element: HTMLElement | Document, htmlTag: string): HTMLElement[] | undefined {
			let elementFound: HTMLElement[];

			if (element) {
				if (htmlTag !== '') {
					elementFound = Array.from(element.querySelectorAll(htmlTag));
				}
				//this is to make sure that we are only returning the element or undefined.
				elementFound = elementFound ? elementFound : undefined;
			} else {
				console.error(`The element does not exist.`);
			}

			return elementFound;
		}
	}
}
