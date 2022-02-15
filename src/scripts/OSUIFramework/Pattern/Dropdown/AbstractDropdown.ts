// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Dropdown {
	export abstract class AbstractDropdown<P, C extends AbstractDropdownConfig>
		extends AbstractPattern<C>
		implements IDropdown, Interface.IProviderPattern<P>
	{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		public get provider(): P {
			return this.provider;
		}

		public set provider(p: P) {
			this.provider = p;
		}

		public abstract beNotifiedFromOptionItem(
			optionItemId: string,
			notifiedTo: Enum.OptionItemNotificationType
		): void;
		public abstract clear(): void;
		public abstract disable(): void;
		public abstract enable(): void;
		public abstract getSelectedValues(): string;
		public abstract registerProviderCallback(eventName: string, callback: Callbacks.OSGeneric): void;
		public abstract validation(isValid: boolean, validationMessage: string): void;
	}
}
