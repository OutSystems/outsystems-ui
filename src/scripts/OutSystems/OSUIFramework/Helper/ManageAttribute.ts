// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUIFramework.Helper.Attribute {
	/**
	 * Method that will add a given attribute to a given html element
	 *
	 * @export
	 * @param {HTMLElement} elem Element where the given attribute will be added
	 * @param {string} attrName Attribute name
	 * @param {string} attrValue Attribute value
	 */
	export function Set(elem: HTMLElement, attrName: string, attrValue: string): void {
		elem.setAttribute(attrName, attrValue);
	}

	/**
	 * Method that will retunr a given attribute value from a given html element
	 *
	 * @export
	 * @param {HTMLElement} elem Element where the attribute will be looked for
	 * @param {string} attrName Attribute name
	 */
	export function Get(elem: HTMLElement, attrName: string): string {
		return elem.getAttribute(attrName);
	}

	/**
	 * Method that will remove a given attribute from a given html element
	 *
	 * @export
	 * @param {HTMLElement} elem Element where the given attribute will be removed
	 * @param {string} attrName Attribute name
	 */
	export function Remove(elem: HTMLElement, attrName: string): void {
		elem.removeAttribute(attrName);
	}
}
