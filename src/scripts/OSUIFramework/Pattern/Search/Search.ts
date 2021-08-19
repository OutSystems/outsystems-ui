// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Search {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Search extends AbstractPattern<SearchConfig> implements ISearch {
		// Store the input html element
		private _inputElem: HTMLElement;

		// Store all the classes strings used by the pattern
		private _searchCssClass = {
			pattern: 'search',
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new SearchConfig(configs));
		}

		// Add Pattern Events
		private _addEvents(): void {
			console.log('Set Events here!');
		}

		// Add the Accessibility Attributes values
		private _setAccessibilityProps(): void {
			console.log('Set Accessibility attributes here!');
		}

		// Update info based on htmlContent
		private _setHtmlElements(): void {
			// Set the html references that will be used to manage the cssClasses and atribute properties
			this._inputElem = this._selfElem.querySelector(Enum.DataBlockTag.Input);
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setInitialCssClasses();

			this._setAccessibilityProps();

			this._addEvents();

			this.finishBuild();
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// Set default ExtendedClass values
			if (this._configs.ExtendedClass !== '') {
				this.UpdateExtendedClass('', this._configs.ExtendedClass);
			}

			console.log('Set all the cssClasses here if needed!');
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

		// Open the Search
		public open(): void {
			// code for open method here
		}

		// Close the search
		public close(): void {
			// code for close method here
		}

		// Destroy the Search
		public destroy(): void {
			super.destroy();
		}
	}
}
