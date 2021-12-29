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

		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.AllowMultipleSelection:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case Enum.Properties.IsDisabled:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case Enum.Properties.NoResultsText:
					validatedValue = this.validateString(value as string, undefined);
					break;
				case Enum.Properties.OptionsList:
					validatedValue = true;
					break;
				case Enum.Properties.Prompt:
					validatedValue = this.validateString(value as string, undefined);
					break;
				case Enum.Properties.SearchPrompt:
					validatedValue = this.validateString(value as string, undefined);
					break;
				case Enum.Properties.SelectedOptions:
					validatedValue = true;
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
