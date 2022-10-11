/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.Patterns.AccordionItem {
	export class AccordionItemConfig extends AbstractConfiguration {
		public Icon: string;
		public IconPosition: string;
		public IsDisabled: boolean;
		public StartsExpanded: boolean;

		constructor(config: JSON) {
			super(config);
		}

		/**
		 * Method used to check if a given property can be changed!
		 *
		 * @param isBuilt if pattern is already built
		 * @param key key name to be checked
		 * @returns {boolean}
		 * @memberof OSFramework.Patterns.AccordionItem.AccordionItemConfig
		 */
		public validateCanChange(isBuilt: boolean, key: string): boolean {
			if (isBuilt) {
				return key !== Enum.Properties.StartsExpanded;
			}
			return true;
		}

		/**
		 * Method used to validate default value before apply it's change!
		 *
		 * @param key property name
		 * @param value value to be set
		 * @returns {*}
		 * @memberof OSFramework.Patterns.AccordionItem.AccordionItemConfig
		 */
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
