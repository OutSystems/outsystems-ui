// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Notification {
	/**
	 * Class that represents the custom configurations received by the Notification.
	 *
	 * @export
	 * @class NotificationConfig
	 * @extends {AbstractConfiguration}
	 */
	export class NotificationConfig extends AbstractConfiguration {
		public CloseAfterTime: number;
		public InteractToClose: boolean;
		public NeedsSwipes: boolean;
		public Position: string;
		public StartsOpen: boolean;
		public Width: string;

		/**
		 * Method that will check if a given property (key) can be changed/updated!
		 *
		 * @param isBuilt True when pattern has been built!
		 * @param key property name
		 * @returns {boolean} boolean
		 * @memberof  OSFramework.Patterns.Notification.NotificationConfig
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
		 * @memberof  OSFramework.Patterns.Notification.NotificationConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.InteractToClose:
					validatedValue = this.validateBoolean(value as boolean, true);
					break;

				case Enum.Properties.NeedsSwipes:
				case Enum.Properties.StartsOpen:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;

				case Enum.Properties.Position:
					validatedValue = this.validateString(value as string, Enum.Defaults.DefaultPosition);
					break;

				case Enum.Properties.Width:
					validatedValue = this.validateString(value as string, Enum.Defaults.DefaultWidth);
					break;

				case Enum.Properties.CloseAfterTime:
					validatedValue = this.validateNumber(value as number, undefined);
					break;

				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
