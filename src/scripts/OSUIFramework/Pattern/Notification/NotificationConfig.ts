// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Notification {
	export class NotificationConfig extends AbstractConfiguration {
		public CloseAfterTime: number;
		public InteractToClose: boolean;
		public NeedsSwipes: boolean;
		public Position: string;
		public StartsOpen: boolean;
		public Width: string;

		/**
		 * Validate if the parameters can change
		 *
		 * @param {boolean} isBuilt
		 * @param {string} key
		 * @return {*}  {boolean}
		 * @memberof NotificationConfig
		 */
		public validateCanChange(isBuilt: boolean, key: string): boolean {
			if (isBuilt) {
				return key !== Enum.Properties.StartsOpen;
			}
			return true;
		}

		/**
		 * Override, Validate configs key values
		 *
		 * @param {string} key
		 * @param {unknown} value
		 * @return {*}  {unknown}
		 * @memberof NotificationConfig
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
