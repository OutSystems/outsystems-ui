// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Accordion {
	/**
	 * Defines the interface for OutSystemsUI Accordion Pattern
	 */
	export interface IAccordion extends Interface.IParent {
		addAccordionItem(accordionItem: AccordionItem.IAccordionItem);
		collapseAllItems();
		expandAllItems();
		removeAccordionItem(uniqueId: string);
		triggerAccordionItemClose(accordionItemId: string);
	}
}
