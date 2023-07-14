// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Accordion {
	/**
	 * Class that represents the custom configurations received by Accordion.
	 *
	 * @export
	 * @class AccordionConfig
	 * @extends {AbstractConfiguration}
	 */
	export class AccordionConfig extends AbstractConfiguration {
		public MultipleItems: boolean;

		constructor(config: JSON) {
			super(config);
		}
	}
}
