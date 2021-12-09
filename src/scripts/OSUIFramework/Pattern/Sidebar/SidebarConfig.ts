// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Sidebar {
	export class SidebarConfig extends AbstractConfiguration {
		private readonly _defaultWith = '300px';
		private _width: string;

		/** PUBLIC PROPERTIES **/
		public Direction: GlobalEnum.Direction;
		public HasOverlay: boolean;
		public IsOpen: boolean;

		constructor(config: JSON) {
			super(config);

			if (this.Direction === undefined) {
				this.Direction = GlobalEnum.Direction.Right;
			}
		}

		/**
		 * Gets the value of the width (already fixed to the right value).
		 *
		 * @type {string}
		 * @memberof SidebarConfig
		 */
		public get Width(): string {
			return this._width;
		}

		/**
		 * This setter enables us to have a single place of control of the width of the sidebar.
		 * Like this, whenever the width is set, we can be sure that it's done having in consideration
		 * the default value in case it's not provided.
		 *
		 * @memberof SidebarConfig
		 */
		public set Width(width: string) {
			//Testing for '', undefined and null value.
			this._width = width && width.trim() ? width : SidebarConfig._defaultWith;
		}
	}
}
