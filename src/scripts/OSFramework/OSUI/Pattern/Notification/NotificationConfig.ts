// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Notification {
	/**
	 * Class that represents the custom configurations received by the Notification.
	 */
	export class NotificationConfig extends AbstractConfiguration {
		/** Milliseconds after which the notification closes itself; 0 or undefined keeps it open. */
		public CloseAfterTime: number;
		/** Closes the notification on interaction outside it (click outside or Escape); ignored on native apps. */
		public InteractToClose: boolean;
		/** Enables swipe gestures to dismiss the notification. */
		public NeedsSwipes: boolean;
		/** Screen position: top (default), top-left, top-right, bottom, bottom-left, bottom-right or center. */
		public Position: string;
		/** Shows the notification as soon as it is built. */
		public StartsOpen: boolean;
		/** Width of the notification (CSS length); 370px by default. */
		public Width: string;

		/**
		 * Method that will check if a given property (key) can be changed/updated!
		 *
		 * @param isBuilt True when pattern has been built!
		 * @param key property name
		 * @returns boolean
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
		 * @returns value
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
