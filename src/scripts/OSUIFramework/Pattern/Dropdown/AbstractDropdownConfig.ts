// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Dropdown {
	export abstract class AbstractDropdownConfig extends Patterns.AbstractProviderConfiguration {
		public DropdownPrompt: string;
		public IsDisabled: boolean;
		public NoResultsText: string;
		public OptionsList: string[];
		public SearchText: string;
		public SelectedOptions: DropDownOption;
		public ShowCheckboxes: boolean;
		public Type: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
