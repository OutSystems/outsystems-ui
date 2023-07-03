// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/AccordionItem/IAccordionItem.ts
namespace OSFramework.Patterns.AccordionItem {
	/**
	 * Defines the interface for OutSystemsUI AccordionItem Pattern
	 */
	export interface IAccordionItem extends Interface.IChild, Interface.IOpenable, Interface.ICallback {
		isDisabled: boolean;
		isOpen: boolean;
		allowTitleEvents();
========
namespace OSFramework.OSUI.Patterns.AccordionItem {
	/**
	 * Defines the interface for OutSystemsUI AccordionItem Pattern
	 */
	export interface IAccordionItem extends Interface.IChild, Interface.IOpenable {
		isDisabled: boolean;
		isOpen: boolean;
		allowTitleEvents(): void;
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/AccordionItem/IAccordionItem.ts
	}
}
