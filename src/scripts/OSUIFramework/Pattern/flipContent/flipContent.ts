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
			this._onClickEvent = this.triggerFlip.bind(this);
		}

		private _onKeyDownPress(e): void {
			//If ESC is pressed then we need to close Flip
			if (this.configs.IsFlipped && e.key === GlobalEnum.Keycodes.Escape) {
				this.triggerFlip();
				e.preventDefault();
				e.stopPropagation();
			}

			//If ENTER or SPACE use toggleClick to validate
			if (e.key === GlobalEnum.Keycodes.Enter || e.key === GlobalEnum.Keycodes.Space) {
				this.triggerFlip();
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
		}

		// Method to set the classes on the pattern's first render, toggle click & parameters changed
		private _setUpClasses(): void {
			if (this.configs.IsFlipped) {
				Helper.Style.AddClass(this._flipElement, Enum.CssClass.IsFlipped);
			} else {
				Helper.Style.RemoveClass(this._flipElement, Enum.CssClass.IsFlipped);
			}
			Helper.Attribute.Set(this._flipWrapper, Enum.CssClass.DataFlipped, this.configs.IsFlipped.toString());
		}

		// Method to set the events on the pattern's first render
		private _setUpEvents(): void {
			if (this.configs.FlipSelf) {
				this._flipElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._onKeyDown);
				this._flipWrapper.addEventListener(GlobalEnum.HTMLEvent.Click, this._onClickEvent);
				Helper.Style.AddClass(this._flipWrapper, Enum.CssClass.FlipSelf);
			} else {
				this._flipElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._onKeyDown);
				this._flipWrapper.removeEventListener(GlobalEnum.HTMLEvent.Click, this._onClickEvent);
				Helper.Style.RemoveClass(this._flipWrapper, Enum.CssClass.FlipSelf);
			}
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
			this._setUpClasses();
			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			switch (propertyName) {
				case Enum.Properties.IsFlipped:
					this.configs.IsFlipped = propertyValue;
					this._setUpClasses();
					break;
				case Enum.Properties.FlipSelf:
					this.configs.FlipSelf = propertyValue;
					this._setUpEvents();
					break;
				default:
					super.changeProperty(propertyName, propertyValue);
					break;
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

		// Public method to trigger the flipping of the pattern and the event on the platform's side
		public triggerFlip(): void {
			this.configs.IsFlipped = !this.configs.IsFlipped;
			Helper.Attribute.Set(this._flipWrapper, Enum.CssClass.DataFlipped, this.configs.IsFlipped.toString());

			Helper.Style.ToggleClass(this._selfElem, Enum.CssClass.IsFlipped);

			this._triggerToggleClick();

			this._setUpClasses();
		}

		public updateOnRender(): void {
			// This won't run until the pattern has been built
			if (this.isBuilt) {
				if (this.configs.IsFlipped) {
					// We need to set this here because it's only when flipped that the back card exists
					this._flipCardBack = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.CardBack);
					Helper.Attribute.Set(
						this._flipCardBack,
						Constants.AccessibilityAttribute.Aria.Hidden,
						(!this.configs.IsFlipped).toString()
					);
				} else {
					// We need to set this here because Front Card doesn't exist until it has been flipped
					this._flipCardFront = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.CardFront);
					Helper.Attribute.Set(
						this._flipCardFront,
						Constants.AccessibilityAttribute.Aria.Hidden,
						this.configs.IsFlipped.toString()
					);
				}
			}
		}
	}
}
