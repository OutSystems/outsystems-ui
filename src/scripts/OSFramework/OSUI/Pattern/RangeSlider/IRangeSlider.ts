// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.RangeSlider {
	/**
	 * Defines the interface for OutSystemsUI rangeSlider Pattern
	 */
	export interface IRangeSlider extends Interface.IPattern {
		disable(uniqueId: string): void;
		enable(uniqueId: string): void;
		setProviderConfigs(providerConfigs: ProviderConfigs): void;
		setProviderEvent(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic, uniqueId: string): void;
		unsetProviderEvent(eventId: string): void;
	}
}
