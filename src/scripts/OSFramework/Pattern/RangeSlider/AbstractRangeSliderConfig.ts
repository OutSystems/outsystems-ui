// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.RangeSlider {
	export abstract class AbstractRangeSliderConfig extends Patterns.AbstractProviderConfiguration {
		// These variables hold the inital state of a RangeSlider
		public InitialValueFrom: number;
		public InitialValueTo: number;
		public IsDisabled: boolean;
		public IsInterval: boolean;
		public MaxValue: number;
		public MinValue: number;
		public Orientation: Orientation;
		public ShowFloatingLabel: boolean;
		public ShowTickMarks: boolean;
		public Size: string;
		public StartingValueFrom: number;
		public StartingValueTo: number;
		public Step: number;
		public TickMarksInterval: number;

		constructor(config: JSON) {
			super(config);
		}

		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.InitialValueFrom:
				case Enum.Properties.InitialValueTo:
					validatedValue = this.validateNumber(value as number, 0);
					break;
				case Enum.Properties.Orientation:
					validatedValue = this.validateInRange(
						value,
						GlobalEnum.Orientation.Horizontal,
						GlobalEnum.Orientation.Vertical
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
						this.Orientation === (GlobalEnum.Orientation.Horizontal as string)
							? Enum.DefaultValues.PercentualSize
							: Enum.DefaultValues.PixelSize
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
