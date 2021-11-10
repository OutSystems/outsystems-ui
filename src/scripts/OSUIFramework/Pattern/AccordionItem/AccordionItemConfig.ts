// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.AccordionItem {
	export class AccordionItemConfig extends AbstractConfiguration {
		public IsDisabled: boolean;
		public IsExpanded: boolean;
		public UsePadding: boolean;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
