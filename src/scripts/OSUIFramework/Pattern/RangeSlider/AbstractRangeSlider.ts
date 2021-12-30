// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.RangeSlider {
	export abstract class AbstractRangeSlider<P, C extends AbstractRangeSliderConfig>
		extends AbstractProviderPattern<P, C>
		implements IRangeSlider, Interface.IProviderPattern<P>
	{
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}
	}
}
