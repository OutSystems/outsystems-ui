// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Dropdown {
	export abstract class AbstractDropdown<P, C extends AbstractDropdownConfig>
		extends AbstractProviderPattern<P, C>
		implements IDropdown
	{
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		public abstract clear(): void;
		public abstract disable(): void;
		public abstract enable(): void;
		public abstract getSelectedValues(): string;
		public abstract registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
		public abstract validation(isValid: boolean, validationMessage: string): void;
	}
}
