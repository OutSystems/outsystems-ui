// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Dropdown {
	export abstract class AbstractDropdownConfig extends Patterns.AbstractProviderConfiguration {
		// @ToDo: Change the name of this props
		public emptyText: string;
		public extendedClass: string;
		public isDisabled: boolean;
		public itemList: Array<string>;
		public noResultsText: string;
		public searchPrompt: string;
		public selectedItems: Array<string>;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
