// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.ButtonLoading {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class ButtonLoading extends AbstractPattern<ButtonLoadingConfig> implements IButtonLoading {
		// Store the button html element that must exist inside ButtonLoading placeholder
		private _buttonElem: HTMLElement;

		// Store the spinner html element that shoul also exist since we've input params for it
		private _spinnerElem: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new ButtonLoadingConfig(configs));
		}

		// Add the Accessibility Attributes values
		private _setAccessibilityProps(): void {
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

			Helper.Attribute.Set(
				this._spinnerElem,
				Constants.AccessibilityAttribute.Aria.Hidden,
				Constants.AccessibilityAttribute.States.True
			);
		}

		// Update info based on htmlContent
		private _setHtmlElements(): void {
			this._buttonElem = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.Button);

			// Since the ButtonElem is a must have element, check if it exist
			if (!this._buttonElem) {
				throw new Error(
					`There are no '${
						Constants.Dot + Enum.CssClass.Button
					}' element as a ButtonLoading placeholder child.`
				);
			}

			this._spinnerElem = this._buttonElem.querySelector(Constants.Dot + Enum.CssClass.Spinner);

			// Since we've input params that will act on SpinnerElement, check if it exist!
			if (!this._spinnerElem) {
				throw new Error(
					`There are no '${Constants.Dot + Enum.CssClass.Spinner}' element as a '${
						Constants.Dot + Enum.CssClass.Button
					}' element child.`
				);
			}
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// Set default IsLoading cssClass property value
			if (this._configs.IsLoading) {
				Helper.Style.AddClass(this._selfElem, Enum.CssClass.IsLoading);
			}

			// Set default ShowLoadingAndLabel cssClass property value
			if (!this._configs.ShowLoadingAndLabel) {
				Helper.Style.AddClass(this._selfElem, Enum.CssClass.ShowSpinnerOnly);
			}
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setInitialCssClasses();

			this._setAccessibilityProps();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			switch (propertyName) {
				case Enum.Properties.IsLoading:
					this._configs.IsLoading = propertyValue;

					Helper.Style.ToggleClass(this._selfElem, Enum.CssClass.IsLoading);

					break;

				case Enum.Properties.ShowLoadingAndLabel:
					this._configs.ShowLoadingAndLabel = propertyValue;

					Helper.Style.ToggleClass(this._selfElem, Enum.CssClass.ShowSpinnerOnly);

					break;

				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}
		}
	}
}
