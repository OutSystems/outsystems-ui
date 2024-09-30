// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.MonthPicker {
	/**
	 * Defines the interface for OutSystemsUI MonthPicker Pattern
	 *
	 * @export
	 * @interface IMonthPicker
	 * @extends {Interface.IPattern}
	 */
	export interface IMonthPicker extends Interface.IPattern, Interface.IOpenable {
		clear(): void;
		open(): void;
		setLanguage(value: string): void;
		setProviderConfigs(providerConfigs: ProviderConfigs): void;
		setProviderEvent(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic, uniqueId: string): void;
		unsetProviderEvent(eventId: string): void;
		updateInitialMonth(monthYear: MonthYear): void;
	}
}
