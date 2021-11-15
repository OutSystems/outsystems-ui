/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSUIFramework.Patterns.AccordionItem {
	export class AccordionItemConfig extends AbstractConfiguration {
		public AccordionParent: OSUIFramework.Patterns.Accordion.IAccordion;
		public IsDisabled: boolean;
		public IsExpanded: boolean;

		constructor(config: JSON) {
			super(config);
		}
	}
}
