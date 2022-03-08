/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSUIFramework.Patterns.AccordionItem {
	export class AccordionItemConfig extends AbstractConfiguration {
		public Icon: string;
		public IconPosition: string;
		public IsDisabled: boolean;
		public StartsExpanded: boolean;

		constructor(config: JSON) {
			super(config);
		}

		public validateCanChange(isBuilt: boolean, key: string): boolean {
			if (isBuilt) {
				return key !== Enum.Properties.StartsExpanded;
			}
			return true;
		}

		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;
			switch (key) {
				case Enum.Properties.IsDisabled:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case Enum.Properties.Icon:
					validatedValue = this.validateString(value as string, Enum.IconType.Caret);
					break;
				case Enum.Properties.IconPosition:
					validatedValue = this.validateString(value as string, GlobalEnum.Direction.Right);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
