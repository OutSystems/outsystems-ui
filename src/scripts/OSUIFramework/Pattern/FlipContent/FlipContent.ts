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

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new FlipContentConfig(configs));
		}
		/**
		 * Toggle pattern on keypress
		 *
		 * @private
		 * @param {KeyboardEvent}
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
		 * Add Attributes and it's values
		 *
		 * @memberof FlipContent
		 */

		private _setDataAttribute(): void {
			Helper.Attribute.Set(this._flipWrapperElement, Enum.CssClass.PatternDataFlipped, this.configs.IsFlipped);
		}
		/**
		 * Set the classes on the pattern's first render, toggle click & parameters changed
		 *
		 * @memberof FlipContent
		 */

		private _toggleClasses(): void {
			if (this.configs.IsFlipped) {
				Helper.Style.AddClass(this._selfElem, Enum.CssClass.PatternIsFlipped);
			} else {
				Helper.Style.RemoveClass(this._selfElem, Enum.CssClass.PatternIsFlipped);
			}
		}
		/**
		 * Triggers the toggle event on the platform
		 *
		 * @memberof FlipContent
		 */

		private _triggerPlatformEvent(): void {
			Helper.AsyncInvocation(this._plataformEventFlip, this.widgetId);
		}
		/**
		 * Update the A11Y attributes
		 *
		 * @memberof FlipContent
		 */

		private _updateA11yProperties(): void {
			if (this._configs.FlipSelf) {
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
			Helper.A11Y.AriaAtomicTrue(this._selfElem);
			Helper.A11Y.TabIndexTrue(this._selfElem);
			Helper.A11Y.RoleButton(this._selfElem);
			Helper.A11Y.AriaLivePolite(this._selfElem);
		}
		/**
		 * Set the events
		 *
		 * @memberof FlipContent
		 */

		protected setCallbacks(): void {
			this._eventKeydown = this._keydownCallback.bind(this);
			this._eventClick = this.toggleFlipContent.bind(this);

			if (this.configs.FlipSelf) {
				this._selfElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventKeydown);
				this._flipWrapperElement.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventClick);

				Helper.Style.AddClass(this._flipWrapperElement, Enum.CssClass.PatternFlipSelf);
			} else {
				this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventKeydown);
				this._flipWrapperElement.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventClick);

				Helper.Style.RemoveClass(this._flipWrapperElement, Enum.CssClass.PatternFlipSelf);
			}
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
		 * Remove the events
		 *
		 * @memberof FlipContent
		 */

		protected unsetCallbacks(): void {
			this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventKeydown);
			this._flipWrapperElement.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventClick);

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
			if (this._configs.FlipSelf) {
				this.setA11yProperties();
			}

			// Set the data attribute
			this._setDataAttribute();

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
						this._toggleClasses();
						break;
					case Enum.Properties.FlipSelf:
						this._updateA11yProperties();
						this.setCallbacks();
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
			super.dispose();
			this.unsetCallbacks();
			this.unsetHtmlElements();
		}
		/**
		 * Register OnToogleClick clientAction as a callBack reference
		 *
		 * @memberof FlipContent
		 */

		public registerCallback(callback: Callbacks.OSFlipContentFlipEvent): void {
			this._plataformEventFlip = callback;
		}
		/**
		 * Public method to trigger the flipping of the pattern and the event on the platform's side
		 *
		 * @memberof FlipContent
		 */

		public toggleFlipContent(): void {
			this.configs.IsFlipped = !this.configs.IsFlipped;

			this._toggleClasses();

			this._setDataAttribute();

			this._triggerPlatformEvent();
		}
	}
}
