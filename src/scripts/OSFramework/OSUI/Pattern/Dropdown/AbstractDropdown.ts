// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Dropdown/AbstractDropdown.ts
namespace OSFramework.Patterns.Dropdown {
========
namespace OSFramework.OSUI.Patterns.Dropdown {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Dropdown/AbstractDropdown.ts
	export abstract class AbstractDropdown<P, C extends AbstractDropdownConfig>
		extends AbstractProviderPattern<P, C>
		implements IDropdown
	{
		/**
		 * Creates an instance of AbstractDropdown.
		 *
		 * @param {string} uniqueId
		 * @param {C} configs
		 * @memberof AbstractDropdown
		 */
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		// Common methods that all Dropdowns must implement!
		public abstract clear(): void;
		public abstract close(): void;
		public abstract disable(): void;
		public abstract enable(): void;
		public abstract getSelectedValues(): string;
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Dropdown/AbstractDropdown.ts
========
		public abstract open(): void;
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Dropdown/AbstractDropdown.ts
		public abstract validation(isValid: boolean, validationMessage: string): void;
	}
}
