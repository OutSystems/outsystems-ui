// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.FlipContent {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class FlipContent extends AbstractPattern<FlipContentConfig> implements IFlipContent {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnKeyDown: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnToogleClick: any;

		// The Flip Content card (back) Element
		private _flipCardBack: HTMLElement;
		// The Flip Content card (front) Element
		private _flipCardFront: HTMLElement;
		// The Flip Content Element
		private _flipElement: HTMLElement;
		//The Flip Content content wrapper
		private _flipWrapper: HTMLElement;

		// Callback function to trigger the click event on the platform
		private _onToogleClick: Callbacks.OSFlipContentFlipEvent;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new FlipContentConfig(configs));

			this._eventOnKeyDown = this._onKeyDownPress.bind(this);
			this._eventOnToogleClick = this.triggerFlip.bind(this);
		}

		private _onKeyDownPress(e: KeyboardEvent): void {
			//If ENTER or SPACE use toggleClick to validate & If ESC is pressed then we need to close Flip
			if (
				e.key === GlobalEnum.Keycodes.Enter ||
				e.key === GlobalEnum.Keycodes.Space ||
				(e.key === GlobalEnum.Keycodes.Escape && this.configs.IsFlipped)
			) {
				this.triggerFlip();
				e.preventDefault();
				e.stopPropagation();
			}
		}

		// Method to remove the events on the pattern's first render
		private _removeEvents(): void {
			this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeyDown);
			this._flipWrapper.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnToogleClick);
		}

		// Set the accessibilty attributes
		private _setAccessibilityAttributes(): void {
			Helper.Attribute.Set(
				this._selfElem,
				Constants.AccessibilityAttribute.TabIndex,
				Constants.AccessibilityAttribute.States.TabIndexShow
			);

			Helper.Attribute.Set(
				this._selfElem,
				Constants.AccessibilityAttribute.Role.AttrName,
				Constants.AccessibilityAttribute.Role.Button
			);

			Helper.Attribute.Set(
				this._selfElem,
				Constants.AccessibilityAttribute.AriaLive.AttrName,
				Constants.AccessibilityAttribute.AriaLive.Polite
			);

			Helper.Attribute.Set(
				this._selfElem,
				Constants.AccessibilityAttribute.Aria.Atomic,
				Constants.AccessibilityAttribute.States.True
			);
		}

		// Add Attributes and it's values
		private _setAttributes(): void {
			Helper.Attribute.Set(this._flipWrapper, Enum.CssClass.DataFlipped, this.configs.IsFlipped);
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
		}

		// Method to set the events on the pattern's first render
		private _setUpEvents(): void {
			if (this.configs.FlipSelf) {
				this._flipElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeyDown);
				this._flipWrapper.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnToogleClick);

				Helper.Style.AddClass(this._flipWrapper, Enum.CssClass.FlipSelf);
			} else {
				this._flipElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeyDown);
				this._flipWrapper.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnToogleClick);

				Helper.Style.RemoveClass(this._flipWrapper, Enum.CssClass.FlipSelf);
			}
		}

		// Method that triggers the toggle event on the platform
		private _triggerToggleClick(): void {
			if (this._onToogleClick) {
				Helper.AsyncInvocation(() => {
					this._onToogleClick(this.widgetId, this.configs.IsFlipped);
				});
			}
		}

		// Method used to set and update the Accessibility attributes value
		private _updateAccessibiltyAttrs(): void {
			if (this._configs.FlipSelf) {
				this._setAccessibilityAttributes();
			} else {
				this._selfElem.blur();
				Helper.Attribute.Remove(this._selfElem, Constants.AccessibilityAttribute.AriaLive.AttrName);
				Helper.Attribute.Remove(this._selfElem, Constants.AccessibilityAttribute.Aria.Atomic);
				Helper.Attribute.Remove(this._selfElem, Constants.AccessibilityAttribute.Role.AttrName);
				Helper.Attribute.Remove(this._selfElem, Constants.AccessibilityAttribute.TabIndex);
			}
		}

		// Building the Flip Content pattern
		public build(): void {
			super.build();

			this._setFlipContent();

			this._setUpEvents();

			this._setUpClasses();

			if (this._configs.FlipSelf) {
				this._setAccessibilityAttributes();
			}

			this._setAttributes();

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
					this._updateAccessibiltyAttrs();
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

		// Register OnToogleClick clientAction as a callBack reference
		public registerCallback(callback: Callbacks.OSFlipContentFlipEvent): void {
			this._onToogleClick = callback;
		}

		// Public method to trigger the flipping of the pattern and the event on the platform's side
		public triggerFlip(): void {
			this.configs.IsFlipped = !this.configs.IsFlipped;

			this._setUpClasses();

			this._setAttributes();

			this._triggerToggleClick();
		}
	}
}
