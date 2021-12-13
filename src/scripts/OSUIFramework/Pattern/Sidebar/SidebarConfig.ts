// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Sidebar {
	export class SidebarConfig extends AbstractConfiguration {
		/** PUBLIC PROPERTIES **/
		public Direction: GlobalEnum.Direction;
		public HasOverlay: boolean;
		public StartsOpen: boolean;
		public Width: string;

		constructor(config: JSON) {
			super(config);
		}

		public validateCanChange(isBuilt: boolean, key: string): boolean {
			if (isBuilt) {
				return key !== Enum.Properties.StartsOpen;
			}
			return true;
		}

		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;
			switch (key) {
				case Enum.Properties.Direction:
					validatedValue = this.validateInRange(
						value,
						GlobalEnum.Direction.Right,
						GlobalEnum.Direction.Right,
						GlobalEnum.Direction.Left
					);
					break;
				case Enum.Properties.HasOverlay:
				case Enum.Properties.StartsOpen:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case Enum.Properties.Width:
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
