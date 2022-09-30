// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.TimePicker {
	/**
	 * Defines the interface for OutSystemsUI TimePicker Pattern
	 */
	export interface ITimePicker extends Interface.IPattern, Interface.IOpenable {
		clear(): void;
		setLanguage(value: string): void;
		setProviderConfigs(providerConfigs: ProviderConfigs): void;
		setProviderEvent(eventName: string, callback: OSFramework.GlobalCallbacks.Generic, uniqueId: string): void;
		unsetProviderEvent(eventId: string): void;
		updateInitialTime(time: string): void;
	}
}
