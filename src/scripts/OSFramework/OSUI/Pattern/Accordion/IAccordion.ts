// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Accordion {
	/**
	 * Defines the interface for OutSystemsUI Accordion Pattern
	 */
	export interface IAccordion extends Interface.IParent {
		/**
		 * Method to add a new accordionItem
		 *
		 * @param {AccordionItem.IAccordionItem} accordionItem
		 * @memberof IAccordion
		 */
		addAccordionItem(accordionItem: AccordionItem.IAccordionItem): void;

		/**
		 * Method to close all accordionItems
		 *
		 * @memberof IAccordion
		 */
		collapseAllItems(): void;

		/**
		 * Method to open all accordionItems
		 *
		 * @memberof IAccordion
		 */
		expandAllItems(): void;

		/**
		 * Method to remove an accordionItem
		 *
		 * @param {string} uniqueId
		 * @memberof IAccordion
		 */
		removeAccordionItem(uniqueId: string): void;

		/**
		 * Method to close all accordionItems
		 *
		 * @param {string} accordionItemId
		 * @memberof IAccordion
		 */
		triggerAccordionItemClose(accordionItemId: string): void;
	}
}
