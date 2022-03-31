// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.FlipContent {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class FlipContent extends AbstractPattern<FlipContentConfig> implements IFlipContent {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventClick: Callbacks.Generic;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventKeydown: Callbacks.Generic;
		//The Flip Content content wrapper
		private _flipWrapperElement: HTMLElement;

		// Callback function to trigger the click event on the platform
		private _plataformEventFlip: Callbacks.OSFlipContentFlipEvent;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new FlipContentConfig(configs));
		}

		// Toggle pattern on keypress
		private _keydownCallback(e: KeyboardEvent): void {
			//If ENTER or SPACE use toggle to validate & If ESC is pressed then we need to close Flip
			if (
				e.key === GlobalEnum.Keycodes.Enter ||
				e.key === GlobalEnum.Keycodes.Space ||
				(e.key === GlobalEnum.Keycodes.Escape && this.configs.IsFlipped)
			) {
				this.toggleFlipContent();
				e.preventDefault();
				e.stopPropagation();
			}
		}

		// Method to remove the event listeners
		private _removeEvents(): void {
			this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventKeydown);
			this._flipWrapperElement.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventClick);
		}

		// Setting the handlers and the classes for when the FlipSelf is active or not
		private _setEventHandlers(): void {
			if (this.configs.FlipSelf) {
				this._selfElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventKeydown);
				this._flipWrapperElement.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventClick);

				Helper.Dom.Styles.AddClass(this._flipWrapperElement, Enum.CssClass.PatternFlipSelf);
			} else {
				this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventKeydown);
				this._flipWrapperElement.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventClick);

				Helper.Dom.Styles.RemoveClass(this._flipWrapperElement, Enum.CssClass.PatternFlipSelf);
			}
		}

		// Toggle FlipContent if is to start flipped
		private _setStartsFlipped() {
			if (this.isBuilt === false) {
				this._toggleClasses();
			}
		}

		// Set the classes on the pattern's first render, toggle click & parameters changed
		private _toggleClasses(): void {
			if (this.configs.IsFlipped) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.PatternIsFlipped);
			} else {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.PatternIsFlipped);
			}
		}

		// Triggers the toggle event on the platform
		private _triggerPlatformEvent(): void {
			if (this._plataformEventFlip) {
				Helper.AsyncInvocation(this._plataformEventFlip.bind(this), this.widgetId, this.configs.IsFlipped);
			}
		}

		// Update the A11Y attributes
		private _updateA11yProperties(): void {
			if (this.configs.FlipSelf) {
				Helper.A11Y.AriaAtomicTrue(this._selfElem);
				Helper.A11Y.TabIndexTrue(this._selfElem);
			} else {
				Helper.A11Y.AriaAtomicFalse(this._selfElem);
				Helper.A11Y.TabIndexFalse(this._selfElem);
			}
		}

		/**
		 * Set the A11Y attributes
		 *
		 * @memberof FlipContent
		 */
		protected setA11yProperties(): void {
			if (this.configs.FlipSelf) {
				Helper.A11Y.AriaAtomicTrue(this._selfElem);
				Helper.A11Y.TabIndexTrue(this._selfElem);
				Helper.A11Y.RoleButton(this._selfElem);
				Helper.A11Y.AriaLivePolite(this._selfElem);
			}
		}

		/**
		 * Set the events
		 *
		 * @memberof FlipContent
		 */
		protected setCallbacks(): void {
			this._eventKeydown = this._keydownCallback.bind(this);
			this._eventClick = this.toggleFlipContent.bind(this);

			this._setEventHandlers();
		}

		/**
		 * Set the HTML elements
		 *
		 * @memberof FlipContent
		 */
		protected setHtmlElements(): void {
			this._flipWrapperElement = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternContainer);
		}

		/**
		 * Method to remove all assigned callbacks
		 *
		 * @memberof FlipContent
		 */
		protected unsetCallbacks(): void {
			this._removeEvents();

			this._eventKeydown = undefined;
			this._eventClick = undefined;
		}

		/**
		 * Set the HTML elements
		 *
		 * @memberof FlipContent
		 */
		protected unsetHtmlElements(): void {
			this._flipWrapperElement = undefined;
		}

		/**
		 * Building Flip Content
		 *
		 * @memberof FlipContent
		 */
		public build(): void {
			super.build();

			this.setHtmlElements();

			this.setCallbacks();

			// Set the initial states
			this._toggleClasses();

			// Set the A11Y defaults
			this.setA11yProperties();

			this.finishBuild();
		}

		/**
		 * Update value when a parameters changed occurs
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof FlipContent
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);
			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.IsFlipped:
						this._setStartsFlipped();
						break;

					case Enum.Properties.FlipSelf:
						this._updateA11yProperties();
						this._setEventHandlers();
						break;
				}
			}
		}

		/**
		 * Destroy FlipContent
		 *
		 * @memberof FlipContent
		 */
		public dispose(): void {
			this.unsetCallbacks();
			this.unsetHtmlElements();

			super.dispose();
		}

		/**
		 * Register OnToogleClick clientAction as a callBack reference
		 *
		 * @memberof FlipContent
		 */
		public registerCallback(callback: Callbacks.OSFlipContentFlipEvent): void {
			if (this._plataformEventFlip === undefined) {
				this._plataformEventFlip = callback;
			}
		}

		public showBackContent(): void {
			if (this.configs.IsFlipped === false) {
				this.toggleFlipContent();
			}
		}

		/**
		 * Tries to show the font
		 *
		 * @memberof FlipContent
		 */
		public showFrontContent(): void {
			if (this.configs.IsFlipped) {
				this.toggleFlipContent();
			}
		}

		/**
		 * Public method to trigger the flipping of the pattern and the event on the platform's side
		 *
		 * @memberof FlipContent
		 */
		public toggleFlipContent(): void {
			this.configs.IsFlipped = !this.configs.IsFlipped;
			// Async to improve animation smoothness
			Helper.AsyncInvocation(this._toggleClasses.bind(this));

			this._triggerPlatformEvent();
		}
	}
}
