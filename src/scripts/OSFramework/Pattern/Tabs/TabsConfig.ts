// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Tabs {
	export class TabsConfig extends AbstractConfiguration {
		public Height: string;
		public JustifyHeaders: boolean;
		public StartingTab: number;
		public TabsOrientation: GlobalEnum.Orientation;
		public TabsVerticalPosition: GlobalEnum.Direction;

		public validateCanChange(isBuilt: boolean, key: string): boolean {
			if (isBuilt) {
				return key !== Enum.Properties.StartingTab;
			}
			return true;
		}

		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;
			switch (key) {
				case Enum.Properties.TabsOrientation:
					validatedValue = this.validateInRange(
						value,
						GlobalEnum.Orientation.Horizontal,
						GlobalEnum.Orientation.Vertical
					);
					break;
				case Enum.Properties.TabsVerticalPosition:
					validatedValue = this.validateInRange(value, GlobalEnum.Direction.Left, GlobalEnum.Direction.Right);
					break;
				case Enum.Properties.JustifyHeaders:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case Enum.Properties.Height:
					validatedValue = this.validateString(value as string, GlobalEnum.CssProperties.Auto);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
