// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Sidebar {
	export class SidebarConfig extends AbstractConfiguration {
		/** PUBLIC PROPERTIES **/
		public Direction: GlobalEnum.Direction;
		public HasOverlay: boolean;
		public IsOpen: boolean;
		public Width: string;

		constructor(config: JSON) {
			super(config);
		}

		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;
			switch (key) {
				case 'Direction':
					validatedValue = this.validateInRange(
						value,
						GlobalEnum.Direction.Right,
						GlobalEnum.Direction.Right,
						GlobalEnum.Direction.Left
					);
					GlobalEnum.Direction.Right;
					break;
				case 'HasOverlay':
				case 'IsOpen':
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case 'Width':
					validatedValue = this.validateString(value as string, '300px');
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
