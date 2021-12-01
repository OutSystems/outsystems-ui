// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Sidebar {
	export class SidebarConfig extends AbstractConfiguration {
		private _width: string;
		public Direction: GlobalEnum.Direction;
		public HasOverlay: boolean;
		public IsOpen: boolean;

		constructor(config: JSON) {
			super(config);

			if (this.Direction === undefined) {
				this.Direction = GlobalEnum.Direction.Right;
			}
		}

		public get Width(): string {
			return this._width || '300px';
		}
		public set Width(width: string) {
			this._width = width !== '' ? width : '300px';
		}
	}
}
