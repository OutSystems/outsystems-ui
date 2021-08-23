// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Search {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Search extends AbstractPattern<SearchConfig> implements ISearch {
		// Store the pattern locals
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnClick: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventWindowClick: any;
		private _inputElem: HTMLInputElement;
		private _inputValue: string;
		private _isLayoutNative = false;
		private _isOpen = false;
		private _searchGlass: HTMLElement;
		private _onCollapse: Callbacks.OSSearchCollapseEvent;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new SearchConfig(configs));

			this._eventOnClick = this._onToggle.bind(this);
			this._eventWindowClick = this._windowClick.bind(this);
		}

		// Add Pattern Events
		private _addEvents(): void {
			// Add events only in Native Applications
			if (this._isLayoutNative) {
				this._searchGlass.addEventListener('click', this._eventOnClick);

				if (this._isOpen) {
					window.addEventListener('click', this._eventWindowClick);
				}
			}
		}

		// Check input value on search
		private _checkInputValue(): void {
			this._inputValue = this._inputElem.value;
		}

		// Trigger the search at toggle behaviour
		private _onToggle(e: MouseEvent): void {
			// Check in input has value
			this._checkInputValue();

			// Toggle the search classes
			if (this._isOpen) {
				this.close();
			} else {
				this.open();
			}

			e.stopPropagation();
		}

		// Add the Accessibility Attributes values
		private _setAccessibilityProps(): void {
			Helper.Attribute.Set(this._selfElem, 'role', 'search');
		}

		// Update info based on htmlContent
		private _setHtmlElements(): void {
			// Set the html references that will be used to manage the cssClasses and atribute properties
			if (document.querySelector('.' + Enum.CssProperty.LayoutNative)) {
				this._isLayoutNative = true;
			}
			this._inputElem = this._selfElem.querySelector(Enum.CssProperty.Input);
			this._searchGlass = this._selfElem.querySelector('.' + Enum.CssProperty.SearchGlass);
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// Set default ExtendedClass values
			if (this._configs.ExtendedClass !== '') {
				this.updateExtendedClass('', this._configs.ExtendedClass);
			}

			if (this._isLayoutNative && this._inputValue !== '') {
				Helper.Style.AddClass(this._selfElem, Enum.CssProperty.PatternIsOpen);

				this._inputElem.focus();

				this._isOpen = true;
			}
		}

		private _triggerOnCollapseEvent(): void {
			if (this._onCollapse !== undefined) {
				setTimeout(() => {
					this._onCollapse(this.widgetId);
				}, 0);
			}
		}

		// Close Search if user has clicked outside of it
		private _windowClick(e: MouseEvent): void {
			const _clickedElem: HTMLElement = e.target as HTMLElement;
			const _closestElem: HTMLElement = _clickedElem.closest('.' + Enum.CssProperty.Pattern);

			// If the click has occur outside of this tooltip
			if (_closestElem !== this._selfElem && _closestElem !== this._searchGlass) {
				// Close Search
				this.close();
				e.stopPropagation();
			}
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._checkInputValue();

			this._setInitialCssClasses();

			this._setAccessibilityProps();

			this._addEvents();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			if (Enum.Property[propertyName] && this._configs.hasOwnProperty(propertyName)) {
				switch (propertyName) {
					case Enum.Property.ExtendedClass:
						this.updateExtendedClass(this._configs.ExtendedClass, propertyValue);

						this._configs.ExtendedClass = propertyValue;

						break;
				}
			} else {
				throw new Error(`changeProperty - Property '${propertyName}' can't be changed.`);
			}
		}

		// Close Search
		public close(): void {
			Helper.Style.RemoveClass(this._selfElem, Enum.CssProperty.PatternIsOpen);

			window.removeEventListener('click', this._eventWindowClick);

			this._inputElem.blur();

			this._triggerOnCollapseEvent();

			this._isOpen = false;
		}

		// Destroy the Search
		public dispose(): void {
			super.dispose();
		}

		// Open Search
		public open(): void {
			Helper.Style.AddClass(this._selfElem, Enum.CssProperty.PatternIsOpen);

			window.addEventListener('click', this._eventWindowClick);

			this._inputElem.focus();

			this._isOpen = true;
		}

		// Set callbacks for the OnCollapse event
		public registerCallback(callback: Callbacks.OSSearchCollapseEvent): void {
			this._onCollapse = callback;
		}
	}
}
