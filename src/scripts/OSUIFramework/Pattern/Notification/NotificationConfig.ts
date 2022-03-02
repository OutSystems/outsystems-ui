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
	}
}
