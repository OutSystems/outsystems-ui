// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/FlipContent/FlipContent.ts
namespace OSFramework.Patterns.FlipContent {
========
namespace OSFramework.OSUI.Patterns.FlipContent {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/FlipContent/FlipContent.ts
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
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/FlipContent/FlipContent.ts
		private _plataformEventFlip: Callbacks.OSFlipEvent;
========
		private _platformEventOnToggle: GlobalCallbacks.OSGeneric;
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/FlipContent/FlipContent.ts

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
			this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventKeydown);
			this._flipWrapperElement.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventClick);
		}

		// Setting the handlers and the classes for when the FlipSelf is active or not
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

		// Toggle FlipContent if is to start flipped
		private _setStartsFlipped() {
			if (this.isBuilt === false) {
				this._toggleClasses();
			}
		}

		// Set the classes on the pattern's first render, toggle click & parameters changed
		private _toggleClasses(): void {
			if (this.configs.IsFlipped) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.PatternIsFlipped);
			} else {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.PatternIsFlipped);
			}
		}

		// Triggers the toggle event on the platform
		private _triggerPlatformEvent(): void {
			this.triggerPlatformEventCallback(this._platformEventOnToggle, this.configs.IsFlipped);
		}

		// Update the A11Y attributes
		private _updateA11yProperties(): void {
			if (this.configs.FlipSelf) {
				Helper.A11Y.AriaAtomicTrue(this.selfElement);
				Helper.A11Y.TabIndexTrue(this.selfElement);
			} else {
				Helper.A11Y.AriaAtomicFalse(this.selfElement);
				Helper.A11Y.TabIndexFalse(this.selfElement);
			}
		}

		/**
		 * Set the A11Y attributes
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.FlipContent.FlipContent
		 */
		protected setA11YProperties(): void {
			if (this.configs.FlipSelf) {
				Helper.A11Y.AriaAtomicTrue(this.selfElement);
				Helper.A11Y.TabIndexTrue(this.selfElement);
				Helper.A11Y.RoleButton(this.selfElement);
				Helper.A11Y.AriaLivePolite(this.selfElement);
			}
		}

		/**
		 * Set the events
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
		 * Set the HTML elements
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
		 * Set the HTML elements
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.FlipContent.FlipContent
		 */
		protected unsetHtmlElements(): void {
			this._flipWrapperElement = undefined;
		}

		/**
		 * Building Flip Content
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
		 * Update value when a parameters changed occurs
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
		 * Destroy FlipContent
		 *
		 * @memberof OSFramework.Patterns.FlipContent.FlipContent
		 */
		public dispose(): void {
			this.unsetCallbacks();
			this.unsetHtmlElements();

			super.dispose();
		}

		/**
		 * Register a given callback event handler.
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.OSGeneric} callback
		 @memberof OSFramework.Patterns.FlipContent.FlipContent
		 */
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/FlipContent/FlipContent.ts
		public registerCallback(callback: Callbacks.OSFlipEvent): void {
			if (this._plataformEventFlip === undefined) {
				this._plataformEventFlip = callback;
========
		public registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case Enum.Events.OnToggle:
					if (this._platformEventOnToggle === undefined) {
						this._platformEventOnToggle = callback;
					}
					break;
				default:
					super.registerCallback(eventName, callback);
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/FlipContent/FlipContent.ts
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
		 * @memberof OSFramework.Patterns.FlipContent.FlipContent
		 */
		public showFrontContent(): void {
			if (this.configs.IsFlipped) {
				this.toggleFlipContent();
			}
		}

		/**
		 * Public method to trigger the flipping of the pattern and the event on the platform's side
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
