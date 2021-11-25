// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.AccordionItem {
	/**
	 * Defines the interface for OutSystemsUI AccordionItem Pattern
	 */
	export interface IAccordionItem extends Interface.IPattern, Interface.IOpenable, Interface.ICallback {
		isDisabled: boolean;
		isExpanded: boolean;
		removeItemAsFirstItem();
		removeItemAsLastItem();
		setItemAsFirstItem();
		setItemAsLastItem();
	}
}
