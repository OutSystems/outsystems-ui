/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSUIFramework.Patterns.AccordionItem {
	export class AccordionItemConfig extends AbstractConfiguration {
		public IsDisabled: boolean;
		public StartsExpanded: boolean;

		constructor(config: JSON) {
			super(config);
		}
	}
}
