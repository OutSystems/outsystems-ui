// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.RangeSlider {
	export abstract class AbstractRangeSlider<P, C extends AbstractRangeSliderConfig>
		extends AbstractProviderPattern<P, C>
		implements IRangeSlider
	{
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}
		public abstract setRangeIntervalChangeOnDragEnd(): void;
	}
}
