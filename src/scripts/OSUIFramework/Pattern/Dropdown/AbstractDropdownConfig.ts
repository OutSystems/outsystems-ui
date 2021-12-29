// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Dropdown {
	export abstract class AbstractDropdownConfig extends Patterns.AbstractProviderConfiguration {
		public AllowMultipleSelection: boolean;
		public IsDisabled: boolean;
		public NoResultsText: string;
		public OptionsList: DropDownOption[];
		public Prompt: string;
		public SearchPrompt: string;
		public SelectedOptions: DropDownOption[];

		constructor(config: JSON) {
			super(config);
		}
	}
}
