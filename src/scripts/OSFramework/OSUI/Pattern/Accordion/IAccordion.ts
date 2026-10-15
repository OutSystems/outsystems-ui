// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Accordion {
	/**
	 * Defines the interface for OutSystemsUI Accordion Pattern
	 */
	export interface IAccordion extends Interface.IParent {
		/**
		 * Method to add a new accordionItem
		 *
		 * @param accordionItem Item to register in the accordion
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
		 * @param uniqueId Unique id of the item to remove
		 */
		removeAccordionItem(uniqueId: string): void;

		/**
		 * Method to close every accordionItem except the given one; does nothing when MultipleItems is true
		 *
		 * @param accordionItemId Unique id of the item that stays open
		 */
		triggerAccordionItemClose(accordionItemId: string): void;
	}
}
