// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tooltip {
	/**
	 * Class that represents the custom configurations received by the Tooltip.
	 *
	 * @export
	 * @class TooltipConfig
	 * @extends {AbstractConfiguration}
	 */
	export class TooltipConfig extends AbstractConfiguration {
		public IsHover: boolean;
		public Position: GlobalEnum.Position;
		public StartVisible: boolean;

		constructor(config: JSON) {
			super(config);
		}

		public validateCanChange(isBuilt: boolean, key: string): boolean {
			if (isBuilt) {
				return key !== Enum.Properties.StartVisible;
			}
			return true;
		}

		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;
			switch (key) {
				case Enum.Properties.IsHover:
					validatedValue = this.validateBoolean(value as boolean, true);
					break;
				case Enum.Properties.StartVisible:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case Enum.Properties.Position:
					validatedValue = this.validateInRange(
						value,
						GlobalEnum.Position.Right,
						Object.values(GlobalEnum.Position)
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
