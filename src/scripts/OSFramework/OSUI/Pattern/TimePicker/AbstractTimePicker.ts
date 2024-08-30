// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.TimePicker {
	export abstract class AbstractTimePicker<P, C extends AbstractTimePickerConfig>
		extends AbstractProviderPattern<P, C>
		implements ITimePicker
	{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		// Commom methods all TimePickers must implement
		public abstract clear(): void;
		public abstract close(): void;
		public abstract onRender(): void;
		public abstract open(): void;
		public abstract setLanguage(value: string): void;
		public abstract updateInitialTime(time: string): void;
		public abstract updatePrompt(promptMessage: string): void;
	}
}
