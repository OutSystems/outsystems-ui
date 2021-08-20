// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Search {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Search extends AbstractPattern<SearchConfig> implements ISearch {
		// Store the pattern locals
		private _isOpen: boolean = false;
		private _inputValue: string;

		// Store the Events
		private _eventOnClick: any;
		private _eventWindowClick: any;

		// Store the input html element
		private _layoutNative: HTMLElement;
		private _inputElem: HTMLElement;
		private _searchGlass: HTMLElement;

		// Store all the classes strings used by the pattern
		private _searchCssClass = {
			pattern: 'search',
			IsOpen: 'open',
		};

		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new SearchConfig(configs));

			this._eventOnClick = this._onToggle.bind(this);
			this._eventWindowClick = this._onToggle.bind(this);
		}

		// Add Pattern Events
		private _addEvents(): void {
			// Add events only in Native Applications
			if (this._layoutNative) {
				this._searchGlass.addEventListener('click', this._eventOnClick);

				if (this._isOpen) {
					window.addEventListener('click', this._eventWindowClick);
				}
			}
		}

		// Check input search value
		private _getInputValue(): void {
			this._inputValue = this._selfElem.querySelector('input').value;
		}

		// Trigger the search at toggle behaviour
		private _onToggle(): void {
			// Check in input has value
			this._getInputValue();

			// Trigger the Toggle method
			this.toggle();
		}

		// Add the Accessibility Attributes values
		private _setAccessibilityProps(): void {
			Helper.Attribute.Set(this._selfElem, 'role', 'search');
		}

		// Update info based on htmlContent
		private _setHtmlElements(): void {
			// Set the html references that will be used to manage the cssClasses and atribute properties
			this._layoutNative = document.querySelector('.' + Enum.CssClasses.LayoutNative);
			this._inputElem = this._selfElem.querySelector(Enum.CssClasses.Input);
			this._searchGlass = this._selfElem.querySelector('.' + Enum.CssClasses.SearchGlass);
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// Set default ExtendedClass values
			if (this._configs.ExtendedClass !== '') {
				this.UpdateExtendedClass('', this._configs.ExtendedClass);
			}

			if (this._layoutNative && this._inputValue !== '') {
				Helper.Style.AddClass(this._selfElem, this._searchCssClass.IsOpen);

				this._inputElem.focus();

				this._isOpen = true;
			}
		}

		// Close Search if user has clicked outside of it
		private _windowClick(e: TouchEvent): void {
			const _clickedElem: HTMLElement = e.target as HTMLElement;
			const _closestElem: HTMLElement = _clickedElem.closest('.' + this._searchCssClass.pattern);

			// If the click has occur outside of this tooltip
			if (_closestElem !== this._selfElem && _closestElem !== this._searchGlass) {
				// Close Search
				this.toggle();
			}

			console.log('body event');
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._getInputValue();

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

		// Destroy the Search
		public destroy(): void {
			super.destroy();
		}

		// Close the search
		public toggle(): void {
			// Toggle the search classes
			if (this._isOpen) {
				Helper.Style.RemoveClass(this._selfElem, this._searchCssClass.IsOpen);

				window.removeEventListener('click', this._eventWindowClick);

				this._isOpen = false;
			} else {
				Helper.Style.AddClass(this._selfElem, this._searchCssClass.IsOpen);

				window.addEventListener('click', this._eventWindowClick);

				this._inputElem.focus();

				this._isOpen = true;
			}
		}
	}
}
