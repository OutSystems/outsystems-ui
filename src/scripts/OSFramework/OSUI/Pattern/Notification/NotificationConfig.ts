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
	}
}
