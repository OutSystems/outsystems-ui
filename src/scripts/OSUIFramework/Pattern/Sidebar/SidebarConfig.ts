// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Sidebar {
	export class SidebarConfig extends AbstractConfiguration {
		// private readonly _defaultWith = '300px';
		// private _width: string;

		/** PUBLIC PROPERTIES **/
		public Direction: GlobalEnum.Direction;
		public HasOverlay: boolean;
		public IsOpen: boolean;
		public Width: string;

		constructor(config: JSON) {
			super(config);

			// if (this.Direction === undefined) {
			// 	this.Direction = GlobalEnum.Direction.Right;
			// }
		}

		// /**
		//  * Gets the value of the width (already fixed to the right value).
		//  *
		//  * @type {string}
		//  * @memberof SidebarConfig
		//  */
		// public get Width(): string {
		// 	return this._width;
		// }

		// /**
		//  * This setter enables us to have a single place of control of the width of the sidebar.
		//  * Like this, whenever the width is set, we can be sure that it's done having in consideration
		//  * the default value in case it's not provided.
		//  *
		//  * @memberof SidebarConfig
		//  */
		// public set Width(width: string) {
		// 	//Testing for '', undefined and null value.
		// 	this._width = width?.trim() ? width : this._defaultWith;
		// }

		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;
			const val = value as string;
			switch (key) {
				case 'Direction':
					validatedValue = GlobalEnum.Direction.Right;
					if (val && val.trim()) {
						if (val === GlobalEnum.Direction.Right || val === GlobalEnum.Direction.Left) {
							validatedValue = val;
						}
					}
					break;
				case 'HasOverlay':
				case 'IsOpen':
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case 'Width':
					validatedValue = val && val.trim() ? val : '300px';
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
