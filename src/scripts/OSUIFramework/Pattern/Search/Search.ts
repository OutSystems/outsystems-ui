// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Search {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Search extends AbstractPattern<SearchConfig> implements ISearch {
		// Store the input html element
		private _inputPlaceholderElem: HTMLElement;

		// Store all the classes strings used by the pattern
		private _searchCssClass = {
			pattern: 'search',
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new SearchConfig(configs));
		}

		// Update info based on htmlContent
		private _setHtmlElements(): void {
			// Set the html references that will be used to manage the cssClasses and atribute properties
			this._inputPlaceholderElem = this._selfElem.querySelector('.' + Enum.CssClasses.InputPlaceholder);
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setInitialCssClasses();

			this._setAccessibilityProps();

			this._addEvents();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			if (Enum.Properties[propertyName] && this._configs.hasOwnProperty(propertyName)) {
				switch (propertyName) {
					case Enum.Properties.ExtendedClass:
						this.UpdateExtendedClass(this._configs.ExtendedClass, propertyValue);

						this._configs.ExtendedClass = propertyValue;

						break;
				}
			} else {
				throw new Error(`changeProperty - Property '${propertyName}' can't be changed.`);
			}
		}

		// Close the search
		public close(): void {
			// code for close method here
		}

		// Destroy the Search
		public destroy(): void {
			super.destroy();
		}

		// Open the Search
		public open(): void {
			// code for open method here
		}
	}
}
