// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Notification {
	export class NotificationConfig extends AbstractConfiguration {
		public CloseAfterTime: number;
		public CloseOnBodyClick: boolean;
		public HasOverlay: boolean;
		public IsOpen: boolean;
		public Position: string;
		public Width: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);

			this.Width = this.Width !== '' ? this.Width : Enum.Defaults.DefaultWidth;
			this.Position = this.Position !== '' ? this.Position : Enum.Defaults.DefaultPosition;
		}
	}
}
