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
		private _isExpanded: string;
		// Callback function to trigger the click event on the platform
		private _onClick: Callbacks.OSFlipContentFlipEvent;
		// Saves the event to disconnect it in the future
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _onClickEvent: any;
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
			this._flipCardBack = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.CardBack);
			this._flipCardFront = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.CardFront);
		}

		// Method to set the events on the pattern's first render
		private _setUpEvents(): void {
			this._selfElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._onKeyDown);
			this._flipWrapper.addEventListener(GlobalEnum.HTMLEvent.Click, this._onClickEvent);
		}

		// Method to trigger the flipping of the pattern and the event on the platform's side
		private _triggerFlip(): void {
			console.log('click');
			const notFlipped = !this._configs.IsFlipped;
			Helper.Attribute.Set(this._flipWrapper, Enum.CssClass.DataFlipped, this._configs.IsFlipped.toString());

			// Is this flipped?
			if (this._configs.IsFlipped) {
				Helper.Style.AddClass(this._selfElem, Enum.CssClass.IsFlipped);
			} else {
				Helper.Style.RemoveClass(this._selfElem, Enum.CssClass.IsFlipped);
			}

			/*Helper.Attribute.Set(
				this._flipCardFront,
				Constants.AccessibilityAttribute.Aria.Hidden,
				this.configs.IsFlipped.toString()
			);
			Helper.Attribute.Set(
				this._flipCardBack,
				Constants.AccessibilityAttribute.Aria.Hidden,
				notFlipped.toString()
			);*/

			this._configs.IsFlipped = !this._configs.IsFlipped;
			//this._triggerToggleClick();
		}

		// Method that triggers the toggle event on the platform
		private _triggerToggleClick(): void {
			if (this._onClick !== undefined) {
				setTimeout(() => {
					this._onClick(this.widgetId, this.configs.IsFlipped);
				}, 0);
			}
		}

		// Building the Flip Content pattern
		public build(): void {
			super.build();
			this._setFlipContent();
			this._setUpEvents();
			this.finishBuild();
		}

		// Destroying the Flip Content Pattern
		public dispose(): void {
			super.dispose();
			this._removeEvents();
		}

		public registerCallback(callback: Callbacks.OSFlipContentFlipEvent): void {
			this._onClick = callback;
		}
	}
}
