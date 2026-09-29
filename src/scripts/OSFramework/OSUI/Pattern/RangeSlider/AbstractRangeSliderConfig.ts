// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.RangeSlider {
	export abstract class AbstractRangeSliderConfig extends Patterns.AbstractProviderConfiguration {
		// These variables hold the inital state of a RangeSlider
		public InitialValueFrom: number;
		// Value of the upper handle when the slider is built (interval mode).
		public InitialValueTo: number;
		// Renders the slider disabled.
		public IsDisabled: boolean;
		// Uses two handles (from/to) instead of a single one.
		public IsInterval: boolean;
		// Upper bound of the range.
		public MaxValue: number;
		// Lower bound of the range.
		public MinValue: number;
		// horizontal (default) or vertical.
		public Orientation: Orientation;
		// Shows the current value in a floating label above the handle.
		public ShowFloatingLabel: boolean;
		// Renders tick marks (pips) along the track.
		public ShowTickMarks: boolean;
		// Track length (CSS length); 100% when horizontal, 100px when vertical.
		public Size: string;
		// Current value of the (lower) handle, kept across provider redraws.
		public StartingValueFrom: number;
		// Current value of the upper handle, kept across provider redraws (interval mode).
		public StartingValueTo: number;
		// Increment between selectable values.
		public Step: number;
		// Distance between tick marks in slider units.
		public TickMarksInterval: number;

		constructor(config: JSON) {
			super(config);
		}

		/**
		 * Method that will check if a given property (key) value is the type expected!
		 *
		 * @param key property name
		 * @param value value to be check
		 * @returns {unknown} value
		 * @memberof  OSFramework.Patterns.RangeSlider.AbstractRangeSliderConfig
		 */
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
