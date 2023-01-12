// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.RangeSlider {
	export abstract class AbstractRangeSlider<P, C extends AbstractRangeSliderConfig>
		extends AbstractProviderPattern<P, C>
		implements IRangeSlider
	{
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		// Commom methods that all RangeSliders must implement
		public abstract disable(): void;
		public abstract enable(): void;
		public abstract setRangeIntervalChangeOnDragEnd(): void;
	}
}
