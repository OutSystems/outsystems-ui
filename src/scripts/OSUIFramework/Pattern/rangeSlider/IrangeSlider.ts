// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.RangeSlider {
	/**
	 * Defines the interface for OutSystemsUI rangeSlider Pattern
	 */
	export interface IRangeSlider extends Interface.IPattern {
		registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void;
	}
}
