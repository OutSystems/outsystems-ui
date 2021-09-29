// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.RangeSlider {
	export abstract class AbstractRangeSliderConfig extends AbstractConfiguration {
		public ChangeEventDuringSlide: boolean;
		public InitialValue: number;
		public IsDisabled: boolean;
		public IsVertical: boolean;
		public MaxValue: number;
		public MinValue: number;
		public PipsStep: number;
		public ShowPips: boolean;
		public Step: number;
		public VerticalHeight: number;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
