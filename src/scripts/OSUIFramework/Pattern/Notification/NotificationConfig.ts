// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Notification {
	export class NotificationConfig extends AbstractConfiguration {
		public ClickToClose: boolean;
		public CloseAfterTime: number;
		public NeedsSwipes: boolean;
		public Position: string;
		public StartsOpen: boolean;
		public Width: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}

		/**
		 * Override, Validate configs key values
		 *
		 * @param {string} key
		 * @param {unknown} value
		 * @return {*}  {unknown}
		 * @memberof AbstractDropdownServerSideItemConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.ClickToClose:
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
