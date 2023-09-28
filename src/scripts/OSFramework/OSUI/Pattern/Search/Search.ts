// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Search {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Search extends AbstractPattern<SearchConfig> implements ISearch {
		// Store pattern visibility
		private _enableNative = false;
		private _isOpen = false;
		private _searchGlassButton: HTMLElement;
		private _searchInput: HTMLInputElement;
		/**
		 * Creates an instance of Search.
		 *
		 * @param {string} uniqueId
		 * @param {JSON} configs
		 * @memberof Search
		 */
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SearchConfig(configs));
		}

		private _nativeSearchBehavior(): void {
			// Store the sate of native behavior
			this._enableNative = true;

			// Add class for native behavior
			this.selfElement.classList.add(Enum.CssClass.PatternNative);

			// Define the input selector
			this._searchInput = Helper.Dom.TagSelector(
				this.selfElement,
				OSFramework.OSUI.GlobalEnum.HTMLElement.Input
			) as HTMLInputElement;

			// Create HTML element for native behavior
			this._searchGlassButton = document.createElement(OSFramework.OSUI.GlobalEnum.HTMLElement.Div);
			this._searchGlassButton.classList.add(Enum.CssClass.PatternGlassButton);
			this.selfElement.appendChild(this._searchGlassButton);

			// Set A11Y properties to elements
			Helper.A11Y.TabIndexFalse(this._searchInput);
			Helper.A11Y.TabIndexTrue(this._searchGlassButton);
			Helper.A11Y.AriaExpandedFalse(this._searchGlassButton);
			Helper.A11Y.AriaLabel(this._searchGlassButton, 'Open Search');

			// Create span element to create the custom glass on search
			const glassCircle = document.createElement(OSFramework.OSUI.GlobalEnum.HTMLElement.Span);
			const glassBar = document.createElement(OSFramework.OSUI.GlobalEnum.HTMLElement.Span);

			// Add classes to each span created
			glassCircle.classList.add(Enum.CssClass.PatternGlassCircle);
			glassBar.classList.add(Enum.CssClass.PatternGlassBar);

			// Add elements into Search glass button
			this._searchGlassButton.appendChild(glassCircle);
			this._searchGlassButton.appendChild(glassBar);

			// Add event listener to created element
			this._searchGlassButton.addEventListener(GlobalEnum.HTMLEvent.Click, this._toggleNativeSearch.bind(this));
		}

		/**
		 * Method to remove all the assigned events
		 *
		 * @private
		 * @memberof Search
		 */
		private _removeEvents(): void {
			this._searchGlassButton.removeEventListener(GlobalEnum.HTMLEvent.Click, this._toggleNativeSearch);
		}

		/**
		 * Method to toogle search visibility in native
		 *
		 * @private
		 * @memberof Search
		 */
		private _toggleNativeSearch(): void {
			if (this._isOpen) {
				// Remove the isOpen class and update the state variable
				this.selfElement.classList.remove(Enum.CssClass.PatternIsOpen);

				// Set A11Y properties
				Helper.A11Y.TabIndexFalse(this._searchInput);
				Helper.A11Y.AriaExpandedFalse(this._searchGlassButton);
				Helper.A11Y.AriaLabel(this._searchGlassButton, 'Open Search');

				this._isOpen = false;
			} else {
				// Focus on search input if is empty
				if (this._searchInput && this._searchInput.value === '') {
					OSFramework.OSUI.Helper.ApplySetTimeOut(() => {
						this._searchInput.focus();
					}, 300);
				}

				// Add the isOpen class and update the state variable
				this.selfElement.classList.add(Enum.CssClass.PatternIsOpen);

				// Set A11Y properties
				Helper.A11Y.TabIndexTrue(this._searchInput);
				Helper.A11Y.AriaExpandedTrue(this._searchGlassButton);
				Helper.A11Y.AriaLabel(this._searchGlassButton, 'Close Search');
				this._isOpen = true;
			}
		}

		/**
		 * Sets the A11Y properties when the pattern is built.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Search.Search
		 */
		protected setA11YProperties(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Set the callbacks that will be assigned to the pattern.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Search.Search
		 */
		protected setCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Set the html references that will be used to manage the cssClasses and atribute properties.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Search.Search
		 */
		protected setHtmlElements(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Unset the callbacks that will be assigned to the pattern.
		 *
		 * @protected
		 * @memberof Search
		 */
		protected unsetCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Reassign the HTML elements to undefined, preventing memory leaks.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Search.Search
		 */
		protected unsetHtmlElements(): void {
			this._searchGlassButton = undefined;
			this._searchInput = undefined;
		}

		/**
		 * Method to build the Search
		 *
		 * @memberof OSFramework.Patterns.Search.Search
		 */
		public build(): void {
			super.build();

			this.finishBuild();
		}

		/**
		 * Destroy the Search
		 *
		 * @memberof OSFramework.Patterns.Search.Search
		 */
		public dispose(): void {
			if (this.isBuilt) {
				// Call methods based of native behavior enablement
				if (this._enableNative) {
					this._removeEvents();
					this.unsetHtmlElements;
				}

				//Destroying the base of pattern
				super.dispose();
			}
		}

		/**
		 * Method to enable the native bahavior (parity with old version of Search)
		 *
		 * @memberof Search
		 */
		public enableNativeBehavior(): void {
			this._nativeSearchBehavior();
		}

		/**
		 * Method to update the aria-label on glass button when has the native behavior enabled
		 *
		 * @param {string} ariaLabel
		 * @memberof Search
		 */
		public setAriaLabel(ariaLabel: string): void {
			if (this._searchGlassButton) {
				Helper.A11Y.AriaLabel(this._searchGlassButton, ariaLabel);
			}
		}

		/**
		 * Get Search native state
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof Search
		 */
		public get IsNativeEnabled(): boolean {
			return this._enableNative;
		}

		/**
		 * Get Search State
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof Search
		 */
		public get IsOpen(): boolean {
			return this._isOpen;
		}
	}
}
