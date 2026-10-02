// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.AccordionItem {
	/**
	 * Defines the interface for OutSystemsUI AccordionItem Pattern
	 */
	export interface IAccordionItem extends Interface.IChild, Interface.IOpenable {
		/**
		 *  Returns the value of disable state
		 */
		isDisabled: boolean;

		/**
		 *  Returns the value of open state
		 */
		isOpen: boolean;

		/**
		 * Method to prevent clicks inside thte title to open the accordion
		 */
		allowTitleEvents(): void;
	}
}
