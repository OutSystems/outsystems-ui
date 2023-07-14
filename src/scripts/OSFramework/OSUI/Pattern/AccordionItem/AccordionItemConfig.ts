/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.OSUI.Patterns.AccordionItem {
	/**
	 * Class that represents the custom configurations received by AccordionItem.
	 *
	 * @export
	 * @class AccordionItemConfig
	 * @extends {AbstractConfiguration}
	 */
	export class AccordionItemConfig extends AbstractConfiguration {
		public Icon: string;
		public IconPosition: string;
		public IsDisabled: boolean;
		public StartsExpanded: boolean;

		constructor(config: JSON) {
			super(config);
		}
	}
}
