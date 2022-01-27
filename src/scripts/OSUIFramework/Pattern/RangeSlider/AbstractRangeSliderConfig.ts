// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.RangeSlider {
	export abstract class AbstractRangeSliderConfig extends Patterns.AbstractProviderConfiguration {
		public IsDisabled: boolean;
		public IsInterval: boolean;
		public MaxValue: number;
		public MinValue: number;
		public Orientation: GlobalEnum.Orientation;
		public ShowFloatingLabel: boolean;
		public ShowTickMarks: boolean;
		public Size: number;
		public StartingValueEnd: number;
		public StartingValueStart: number;
		public Step: number;
		public TickMarksInterval: number;

		constructor(config: JSON) {
			super(config);
		}

		public validateCanChange(isBuilt: boolean, key: string): boolean {
			if (isBuilt) {
				return (
					key !== (Enum.Properties.StartingValueStart as string) ||
					key !== (Enum.Properties.StartingValueEnd as string)
				);
			}
			return true;
		}

		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.Orientation:
					validatedValue = this.validateInRange(
						value,
						GlobalEnum.Orientation.Horizontal,
						GlobalEnum.Orientation.Vertical,
						GlobalEnum.Orientation.Horizontal
					);
					break;
				case Enum.Properties.IsDisabled:
				case Enum.Properties.ShowFloatingLabel:
				case Enum.Properties.ShowTickMarks:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case Enum.Properties.Size:
					validatedValue = this.validateString(
						value as string,
						this.Orientation === (GlobalEnum.Orientation.Horizontal as string) ? '100%' : '100px'
					);
					break;
				case Enum.Properties.Step:
					validatedValue = this.validateNumber(value as number, 1);
					break;
				case Enum.Properties.TickMarksInterval:
					validatedValue = this.validateNumber(value as number, 0);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
