// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Dropdown {
	export abstract class AbstractDropdown<C extends AbstractDropdownConfig>
		extends AbstractPattern<C>
		implements IDropdown
	{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		public build(): void {
			super.build();
		}
	}
}
