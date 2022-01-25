// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.RangeSlider {
	export abstract class AbstractRangeSliderConfig extends Patterns.AbstractProviderConfiguration {
		public InitialValueEnd: number;
		public InitialValueStart: number;
		public IsDisabled: boolean;
		public IsInterval: boolean;
		public IsVertical: boolean;
		public MaxValue: number;
		public MinValue: number;
		public PipsStep: number;
		public ShowPips: boolean;
		public ShowTooltip: boolean;
		public Step: number;
		public VerticalHeight: number;

		constructor(config: JSON) {
			super(config);
		}
	}
}
