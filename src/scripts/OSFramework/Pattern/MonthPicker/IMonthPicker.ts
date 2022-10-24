// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.MonthPicker {
	/**
	 * Defines the interface for OutSystemsUI MonthPicker Pattern
	 *
	 * @export
	 * @interface IMonthPicker
	 * @extends {Interface.IPattern}
	 */
	export interface IMonthPicker extends Interface.IPattern, Interface.IOpenable {
		clear(): void;
		setLanguage(value: string): void;
		setProviderConfigs(providerConfigs: ProviderConfigs): void;
		setProviderEvent(eventName: string, callback: OSFramework.GlobalCallbacks.Generic, uniqueId: string): void;
		unsetProviderEvent(eventId: string): void;
	}
}
