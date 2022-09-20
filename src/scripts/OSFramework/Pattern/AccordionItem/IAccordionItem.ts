// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.AccordionItem {
	/**
	 * Defines the interface for OutSystemsUI AccordionItem Pattern
	 */
	export interface IAccordionItem extends Interface.IChild, Interface.IOpenable, Interface.ICallback {
		isDisabled: boolean;
		isOpen: boolean;
		allowTitleEvents();
	}
}
