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
		// Indicator icon: Caret, PlusMinus or Custom (a developer-supplied icon in the item's icon placeholder).
		public Icon: string;
		// Side of the title where the indicator icon is rendered (left or right).
		public IconPosition: string;
		// Prevents the user from expanding or collapsing the item.
		public IsDisabled: boolean;
		// Renders the item already expanded when it is built.
		public StartsExpanded: boolean;
		// When true only the icon toggles the item; otherwise the whole title area does.
		public ToggleWithIcon: boolean;

		constructor(config: JSON) {
			super(config);
			this.ToggleWithIcon = false;
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
				case Enum.Properties.ToggleWithIcon:
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
