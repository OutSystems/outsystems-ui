// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.OverflowMenu {
	/**
	 * Class that represents the custom configurations received by the OverflowMenu.
	 */
	export class OverflowMenuConfig extends AbstractConfiguration {
		/** Preferred placement of the menu relative to its trigger (GlobalEnum.FloatingPosition); auto picks the best fit. */
		public Position: GlobalEnum.FloatingPosition;
		/** Corner shape of the menu: SoftRounded (default), Rounded or Sharp. */
		public Shape: GlobalEnum.ShapeTypes;

		constructor(config: JSON) {
			super(config);
		}

		/**
		 * Override, Validate configs key values
		 *
		 * @param key
		 * @param value
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;
			switch (key) {
				case Enum.Properties.Shape:
					validatedValue = this.validateInRange(
						value,
						GlobalEnum.ShapeTypes.SoftRounded,
						GlobalEnum.ShapeTypes.Sharp,
						GlobalEnum.ShapeTypes.Rounded
					);
					break;
				case Enum.Properties.Position:
					validatedValue = this.validateInRange(
						value,
						GlobalEnum.FloatingPosition.Auto,
						GlobalEnum.FloatingPosition.Bottom,
						GlobalEnum.FloatingPosition.BottomEnd,
						GlobalEnum.FloatingPosition.BottomStart,
						GlobalEnum.FloatingPosition.Center,
						GlobalEnum.FloatingPosition.Left,
						GlobalEnum.FloatingPosition.LeftEnd,
						GlobalEnum.FloatingPosition.LeftStart,
						GlobalEnum.FloatingPosition.Right,
						GlobalEnum.FloatingPosition.RightEnd,
						GlobalEnum.FloatingPosition.RightStart,
						GlobalEnum.FloatingPosition.Top,
						GlobalEnum.FloatingPosition.TopEnd,
						GlobalEnum.FloatingPosition.TopStart
					);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
