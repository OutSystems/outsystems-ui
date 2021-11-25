// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper.Attribute {
	/**
	 * Method that will add a given attribute to a given html element
	 *
	 * @export
	 * @param {HTMLElement} elem Element where the given attribute will be added
	 * @param {string} attrName Attribute name
	 * @param {string} attrValue Attribute value
	 */
	export function Set(elem: HTMLElement, attrName: string, attrValue: string | boolean | number): void {
		if (elem) {
			elem.setAttribute(attrName, attrValue.toString());
		} else {
			throw Error(`The element does not exist, when trying to set the attribute '${attrName}'.`);
		}
	}

	/**
	 * Method that will retunr a given attribute value from a given html element
	 *
	 * @export
	 * @param {HTMLElement} elem Element where the attribute will be looked for
	 * @param {string} attrName Attribute name
	 */
	export function Get(elem: HTMLElement, attrName: string): string {
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
	export function Remove(elem: HTMLElement, attrName: string): void {
		if (elem) {
			elem.removeAttribute(attrName);
		} else {
			throw Error(`The element does not exist, when trying to remove the attribute '${attrName}'.`);
		}
	}
}
