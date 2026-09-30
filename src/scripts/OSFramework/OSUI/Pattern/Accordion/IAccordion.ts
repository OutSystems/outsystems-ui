// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Accordion {
	/**
	 * Defines the interface for OutSystemsUI Accordion Pattern
	 */
	export interface IAccordion extends Interface.IParent {
		/**
		 * Method to add a new accordionItem
		 *
		 * @param accordionItem
		 */
		addAccordionItem(accordionItem: AccordionItem.IAccordionItem): void;

		/**
		 * Method to close all accordionItems
		 */
		collapseAllItems(): void;

		/**
		 * Method to open all accordionItems
		 */
		expandAllItems(): void;

		/**
		 * Method to remove an accordionItem
		 *
		 * @param uniqueId
		 */
		removeAccordionItem(uniqueId: string): void;

		/**
		 * Method to close all accordionItems
		 *
		 * @param accordionItemId
		 */
		triggerAccordionItemClose(accordionItemId: string): void;
	}
}
