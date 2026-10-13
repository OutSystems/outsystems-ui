// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Tabs {
	/**
	 * Class that represents the custom configurations received by Tabs.
	 */
	export class TabsConfig extends AbstractConfiguration {
		/** Sizes the content area to the active tab instead of the tallest tab. */
		public ContentAutoHeight: boolean;
		/** Height of the tabs content (CSS length); auto by default. */
		public Height: string;
		/** Stretches the header items to fill the available width. */
		public JustifyHeaders: boolean;
		/** Zero-based index of the tab active when built; cannot be changed afterwards. */
		public StartingTab: number;
		/** horizontal (headers above the content) or vertical (headers beside it). */
		public TabsOrientation: GlobalEnum.Orientation;
		/** Side of the content where vertical headers sit: left or right. */
		public TabsVerticalPosition: GlobalEnum.Direction;

		/**
		 * Method that will check if a given property (key) can be changed/updated!
		 *
		 * @param isBuilt True when pattern has been built!
		 * @param key property name
		 * @returns boolean
		 */
		public validateCanChange(isBuilt: boolean, key: string): boolean {
			if (isBuilt) {
				return key !== Enum.Properties.StartingTab;
			}
			return true;
		}

		/**
		 * Method that will check if a given property (key) value is the type expected!
		 *
		 * @param key property name
		 * @param value value to be check
		 * @returns value
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;
			switch (key) {
				case Enum.Properties.TabsOrientation:
					validatedValue = this.validateInRange(
						value,
						GlobalEnum.Orientation.Horizontal,
						GlobalEnum.Orientation.Vertical
					);
					break;
				case Enum.Properties.TabsVerticalPosition:
					validatedValue = this.validateInRange(value, GlobalEnum.Direction.Left, GlobalEnum.Direction.Right);
					break;
				case Enum.Properties.ContentAutoHeight:
				case Enum.Properties.JustifyHeaders:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case Enum.Properties.Height:
					validatedValue = this.validateString(value as string, GlobalEnum.CssProperties.Auto);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
