// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Sidebar {
	/**
	 * Class that represents the custom configurations received by the Sidebar.
	 *
	 * @export
	 * @class SidebarConfig
	 * @extends {AbstractConfiguration}
	 */
	export class SidebarConfig extends AbstractConfiguration {
		/** PUBLIC PROPERTIES **/
		public Direction: GlobalEnum.Direction;
		public HasOverlay: boolean;
		public StartsOpen: boolean;
		public Width: string;

		constructor(config: JSON) {
			super(config);
		}

		/**
		 * Method that will check if a given property (key) can be changed/updated!
		 *
		 * @param isBuilt True when pattern has been built!
		 * @param key property name
		 * @returns {boolean} boolean
		 * @memberof  OSFramework.Patterns.Sidebar.SidebarConfig
		 */
		public validateCanChange(isBuilt: boolean, key: string): boolean {
			if (isBuilt) {
				return key !== Enum.Properties.StartsOpen;
			}
			return true;
		}

		/**
		 * Method that will check if a given property (key) value is the type expected!
		 *
		 * @param key property name
		 * @param value value to be check
		 * @returns {unknown} value
		 * @memberof  OSFramework.Patterns.Sidebar.SidebarConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;
			switch (key) {
				case Enum.Properties.Direction:
					validatedValue = this.validateInRange(
						value,
						GlobalEnum.Direction.Right,
						GlobalEnum.Direction.Right,
						GlobalEnum.Direction.Left
					);
					break;
				case Enum.Properties.HasOverlay:
				case Enum.Properties.StartsOpen:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case Enum.Properties.Width:
					validatedValue = this.validateString(value as string, Enum.Defaults.Width);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
