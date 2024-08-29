// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.DatePicker {
	/**
	 * Defines the interface for OutSystemsUI DatePicker Pattern
	 */
	export interface IDatePicker extends Interface.IPattern {
		clear(): void;
		close(): void;
		disableDays(disableDays: string[]): void;
		disableWeekDays(disableDays: number[]): void;
		onRender(): void;
		open(): void;
		setLanguage(value: string): void;
		setProviderConfigs(providerConfigs: ProviderConfigs): void;
		setProviderEvent(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic, uniqueId: string): void;
		unsetProviderEvent(eventId: string): void;
		updateInitialDate(date1: string, date2?: string): void;
		updatePrompt(promptMessage: string): void;
	}
}
