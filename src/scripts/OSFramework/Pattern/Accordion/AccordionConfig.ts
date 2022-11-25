// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Accordion {
	export class AccordionConfig extends AbstractConfiguration {
		public MultipleItems: boolean;

		constructor(config: JSON) {
			super(config);
		}

		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;
			switch (key) {
				case Enum.Properties.MultipleItems:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
