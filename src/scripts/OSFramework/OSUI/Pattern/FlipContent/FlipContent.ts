// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.FlipContent {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class FlipContent extends AbstractPattern<FlipContentConfig> implements IFlipContent {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventClick: GlobalCallbacks.Generic;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventKeydown: GlobalCallbacks.Generic;
		//The Flip Content content wrapper
		private _flipWrapperElement: HTMLElement;

		// Callback function to trigger the click event on the platform
		private _platformEventOnToggle: GlobalCallbacks.OSGeneric;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new FlipContentConfig(configs));
		}

		/**
		 * Method to toggle pattern on keypress
		 *
		 * @private
		 * @param {KeyboardEvent} e
		 * @memberof FlipContent
		 */
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

		/**
		 * Method to remove the event listeners
		 *
		 * @private
		 * @memberof FlipContent
		 */
		private _removeEvents(): void {
			this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventKeydown);
			this._flipWrapperElement.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventClick);
		}

		/**
		 * Method to set the handlers and the classes for when the FlipSelf is active or not
		 *
		 * @private
		 * @memberof FlipContent
		 */
		private _setEventHandlers(): void {
			if (this.configs.FlipSelf) {
				this.selfElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventKeydown);
				this._flipWrapperElement.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventClick);

				Helper.Dom.Styles.AddClass(this._flipWrapperElement, Enum.CssClass.PatternFlipSelf);
			} else {
				this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventKeydown);
				this._flipWrapperElement.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventClick);

				Helper.Dom.Styles.RemoveClass(this._flipWrapperElement, Enum.CssClass.PatternFlipSelf);
			}
		}

		/**
		 * Method to toggle FlipContent, if is to start flipped
		 *
		 * @private
		 * @memberof FlipContent
		 */
		private _setStartsFlipped() {
			if (this.isBuilt === false) {
				this._toggleClasses();
			}
		}

		/**
		 * Method to set the classes on the pattern's first render, toggle click & parameters changed
		 *
		 * @private
		 * @memberof FlipContent
		 */
		private _toggleClasses(): void {
			if (this.configs.IsFlipped) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.PatternIsFlipped);
			} else {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.PatternIsFlipped);
			}
		}

		/**
		 * Method to trigger the toggle event on the platform
		 *
		 * @private
		 * @memberof FlipContent
		 */
		private _triggerPlatformEvent(): void {
			this.triggerPlatformEventCallback(this._platformEventOnToggle, this.configs.IsFlipped);
		}

		/**
		 * Method to update the A11Y attributes
		 *
		 * @private
		 * @memberof FlipContent
		 */
		private _updateA11yProperties(): void {
			if (this.configs.FlipSelf) {
				Helper.A11Y.TabIndexTrue(this.selfElement);
			} else {
				Helper.A11Y.TabIndexFalse(this.selfElement);
			}
		}

		/**
		 * Method to set the A11Y attributes
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.FlipContent.FlipContent
		 */
		protected setA11YProperties(): void {
			if (this.configs.FlipSelf) {
				Helper.A11Y.TabIndexTrue(this.selfElement);
				Helper.A11Y.RoleButton(this.selfElement);
			}
		}

		/**
		 * Method to set the events
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.FlipContent.FlipContent
		 */
		protected setCallbacks(): void {
			this._eventKeydown = this._keydownCallback.bind(this);
			this._eventClick = this.toggleFlipContent.bind(this);

			this._setEventHandlers();
		}

		/**
		 * Method to set the HTML elements
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.FlipContent.FlipContent
		 */
		protected setHtmlElements(): void {
			this._flipWrapperElement = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.PatternContainer);
		}

		/**
		 * Method to remove all assigned callbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.FlipContent.FlipContent
		 */
		protected unsetCallbacks(): void {
			this._removeEvents();

			this._eventKeydown = undefined;
			this._eventClick = undefined;
		}

		/**
		 * Method to set the HTML elements
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.FlipContent.FlipContent
		 */
		protected unsetHtmlElements(): void {
			this._flipWrapperElement = undefined;
		}

		/**
		 * Method to build the Flip Content
		 *
		 * @memberof OSFramework.Patterns.FlipContent.FlipContent
		 */
		public build(): void {
			super.build();

			this.setHtmlElements();

			this.setCallbacks();

			// Set the initial states
			this._toggleClasses();

			// Set the A11Y defaults
			this.setA11YProperties();

			this.finishBuild();
		}

		/**
		 * Method to update value when a parameters changed occurs
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof OSFramework.Patterns.FlipContent.FlipContent
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
		 * Method to destroy FlipContent
		 *
		 * @memberof OSFramework.Patterns.FlipContent.FlipContent
		 */
		public dispose(): void {
			this.unsetCallbacks();
			this.unsetHtmlElements();

			super.dispose();
		}

		/**
		 * Method to register a given callback event handler.
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.OSGeneric} callback
		 @memberof OSFramework.Patterns.FlipContent.FlipContent
		 */
		public registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case Enum.Events.OnToggle:
					if (this._platformEventOnToggle === undefined) {
						this._platformEventOnToggle = callback;
					}
					break;
				default:
					super.registerCallback(eventName, callback);
			}
		}

		/**
		 * Method to show the back content
		 *
		 * @memberof FlipContent
		 */
		public showBackContent(): void {
			if (this.configs.IsFlipped === false) {
				this.toggleFlipContent();
			}
		}

		/**
		 * Method to show the front content
		 *
		 * @memberof OSFramework.Patterns.FlipContent.FlipContent
		 */
		public showFrontContent(): void {
			if (this.configs.IsFlipped) {
				this.toggleFlipContent();
			}
		}

		/**
		 * Method to trigger the flipping of the pattern and the event on the platform's side
		 *
		 * @memberof OSFramework.Patterns.FlipContent.FlipContent
		 */
		public toggleFlipContent(): void {
			this.configs.IsFlipped = !this.configs.IsFlipped;
			// Async to improve animation smoothness
			Helper.AsyncInvocation(this._toggleClasses.bind(this));

			this._triggerPlatformEvent();
		}
	}
}
