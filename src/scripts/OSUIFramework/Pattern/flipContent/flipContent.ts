// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.FlipContent {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class FlipContent extends AbstractPattern<FlipContentConfig> implements IFlipContent {
		// The Flip Content card (back) Element
		private _flipCardBack: HTMLElement;
		// The Flip Content card (front) Element
		private _flipCardFront: HTMLElement;
		// The Flip Content Element
		private _flipElement: HTMLElement;
		//The Flip Content content wrapper
		private _flipWrapper: HTMLElement;
		//Contains the state of "flipness" of the content for accessiblity purposes
		private _isExpanded: string;
		// Callback function to trigger the click event on the platform
		private _onClick: Callbacks.OSFlipContentFlipEvent;

		// Saves the event to disconnect it in the future
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _onClickEvent: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _onKeyDown: any;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new FlipContentConfig(configs));

			this._onKeyDown = this._onKeyDownPress.bind(this);
			this._onClickEvent = this._triggerFlip.bind(this);
		}

		private _onKeyDownPress(e): void {
			this._isExpanded = this._flipWrapper.getAttribute(Enum.CssClass.DataFlipped);

			//If ESC is pressed then we need to close Flip
			if (this._isExpanded === 'True' && e.keyCode === GlobalEnum.Keycodes.Escape) {
				this._triggerToggleClick();
				e.preventDefault();
				e.stopPropagation();
			}

			//If ENTER or SPCE use toggleClick to validate
			if (e.keyCode === GlobalEnum.Keycodes.Enter || e.keyCode === GlobalEnum.Keycodes.Space) {
				this._triggerToggleClick();
				e.preventDefault();
			}
		}

		// Method to remove the events on the pattern's first render
		private _removeEvents(): void {
			this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._onKeyDown);
			this._flipWrapper.removeEventListener(GlobalEnum.HTMLEvent.Click, this._onClickEvent);
		}

		// Method to set the variables on the pattern's first render
		private _setFlipContent(): void {
			this._flipElement = this._selfElem;
			this._flipWrapper = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.FlipContainer);
			this._flipCardFront = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.CardFront);
		}

		// Method to set the events on the pattern's first render
		private _setUpEvents(): void {
			if (!this.configs.IsFlipped) {
				this._selfElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._onKeyDown);
				this._flipWrapper.addEventListener(GlobalEnum.HTMLEvent.Click, this._onClickEvent);
			} else {
				this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._onKeyDown);
				this._flipWrapper.removeEventListener(GlobalEnum.HTMLEvent.Click, this._onClickEvent);
			}
		}

		// Method to trigger the flipping of the pattern and the event on the platform's side
		private _triggerFlip(): void {
			const notFlipped = !this._configs.IsFlipped;
			Helper.Attribute.Set(this._flipWrapper, Enum.CssClass.DataFlipped, notFlipped.toString());

			Helper.Style.ToggleClass(this._selfElem, Enum.CssClass.IsFlipped);
			this._configs.IsFlipped = !this._configs.IsFlipped;
			this._triggerToggleClick();

			// At this point, there isn't Flip Card Back yet as it hasn't been rendered - it's only when it's flipped that it exists

			this._flipCardBack = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.CardBack);

			// Is this flipped?
			if (this._configs.IsFlipped) {
				Helper.Attribute.Set(
					this._flipCardBack,
					Constants.AccessibilityAttribute.Aria.Hidden,
					notFlipped.toString()
				);
			} else {
				Helper.Attribute.Set(
					this._flipCardFront,
					Constants.AccessibilityAttribute.Aria.Hidden,
					this.configs.IsFlipped.toString()
				);
			}
		}

		// Method that triggers the toggle event on the platform
		private _triggerToggleClick(): void {
			if (this._onClick !== undefined) {
				this._onClick(this.widgetId, this.configs.IsFlipped);
			}
		}

		// Building the Flip Content pattern
		public build(): void {
			super.build();
			this._setFlipContent();
			this._setUpEvents();
			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			if (Enum.Properties[propertyName] && this._configs.hasOwnProperty(propertyName)) {
				switch (propertyName) {
					case Enum.Properties.IsFlipped:
						this._configs.IsFlipped = propertyValue;
						this._triggerFlip();
						break;
					case Enum.Properties.FlipSelf:
						this._configs.FlipSelf = propertyValue;
						this._setUpEvents();
						break;
				}
			} else {
				throw new Error(`changeProperty - Property '${propertyName}' can't be changed.`);
			}
		}

		// Destroying the Flip Content Pattern
		public dispose(): void {
			super.dispose();
			this._removeEvents();
		}

		public registerCallback(callback: Callbacks.OSFlipContentFlipEvent): void {
			this._onClick = callback;
		}

		// Public method to trigger the flip
		public triggerFlipContent(): void {
			this._triggerFlip();
		}
	}
}
