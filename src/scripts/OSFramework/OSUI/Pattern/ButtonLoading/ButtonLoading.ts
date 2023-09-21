// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.ButtonLoading {
	//TODO: change the namespace to Pattern instead of Patterns
	/**
	 *  Class that implements the ButtonLoading pattern.
	 *
	 * @export
	 * @class ButtonLoading
	 * @extends {AbstractPattern<ButtonLoadingConfig>}
	 * @implements {IButtonLoading}
	 */
	export class ButtonLoading extends AbstractPattern<ButtonLoadingConfig> implements IButtonLoading {
		// Store the button html element that must exist inside ButtonLoading placeholder
		private _buttonElement: HTMLElement;

		// Store the spinner html element that shoul also exist since we've input params for it
		private _spinnerElement: HTMLElement;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new ButtonLoadingConfig(configs));
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialButtonState(): void {
			// Set default IsLoading cssClass property value
			this._setIsLoading(this.configs.IsLoading);
			// Set default ShowLoadingAndLabel cssClass property value
			this._setLoadingLabel(this.configs.ShowLoadingAndLabel);
		}

		// Sets the new state of the button. If it's loading or not loading.
		private _setIsLoading(isLoading: boolean): void {
			if (isLoading) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsLoading);
				Helper.A11Y.AriaBusyTrue(this.selfElement);
				this.isBuilt &&
					Helper.Dom.Attribute.Set(this._buttonElement, GlobalEnum.HTMLAttributes.Disabled, 'true');
				this._buttonElement.blur();
			} else {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.IsLoading);
				Helper.A11Y.AriaBusyFalse(this.selfElement);
				this.isBuilt && Helper.Dom.Attribute.Remove(this._buttonElement, GlobalEnum.HTMLAttributes.Disabled);
			}
		}

		// Sets if the button should display label or not.
		private _setLoadingLabel(showSpinnerOnly: boolean): void {
			//let's remove the class only and only when the pattern is already built and the showSpinnerOnly is false.
			if (showSpinnerOnly && this.isBuilt) {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.ShowSpinnerOnly);
			} else if (showSpinnerOnly === false) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.ShowSpinnerOnly);
			}
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.ButtonLoading.ButtonLoading
		 */
		protected setA11YProperties(): void {
			Helper.A11Y.AriaLivePolite(this.selfElement);
			Helper.A11Y.AriaAtomicTrue(this.selfElement);
			Helper.A11Y.AriaHiddenTrue(this._spinnerElement);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.ButtonLoading.ButtonLoading
		 */
		protected setCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.ButtonLoading.ButtonLoading
		 */
		protected setHtmlElements(): void {
			this._buttonElement = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.Button);

			// Since the ButtonElem is a must have element, check if it exist
			if (this._buttonElement === undefined) {
				throw new Error(
					`There are no '${Constants.Dot + Enum.CssClass.Button}' element as a  ${
						GlobalEnum.PatternName.ButtonLoading
					}  placeholder child.`
				);
			}

			this._spinnerElement = Helper.Dom.ClassSelector(this._buttonElement, Enum.CssClass.Spinner);

			// Since we've input params that will act on SpinnerElement, check if it exist!
			if (this._spinnerElement === undefined) {
				throw new Error(
					`There are no '${Constants.Dot + Enum.CssClass.Spinner}' element as a '${
						Constants.Dot + Enum.CssClass.Button
					}' element child.`
				);
			}
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.ButtonLoading.ButtonLoading
		 */
		protected unsetCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Removes the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.ButtonLoading.ButtonLoading
		 */
		protected unsetHtmlElements(): void {
			this._buttonElement = undefined;
			this._spinnerElement = undefined;
		}

		/**
		 * Method to build the button loading.
		 *
		 * @memberof OSFramework.Patterns.ButtonLoading.ButtonLoading
		 */
		public build(): void {
			super.build();

			this.setHtmlElements();

			this._setInitialButtonState();

			this.setA11YProperties();

			this.finishBuild();
		}

		/**
		 * Applies the changes of state/value of the configurations.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof OSFramework.Patterns.ButtonLoading.ButtonLoading
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.IsLoading:
						this._setIsLoading(propertyValue as boolean);
						break;

					case Enum.Properties.ShowLoadingAndLabel:
						this._setLoadingLabel(propertyValue as boolean);
						break;
				}
			}
		}

		/**
		 * Disposes the current pattern.
		 *
		 * @memberof OSFramework.Patterns.ButtonLoading.ButtonLoading
		 */
		public dispose(): void {
			this.unsetHtmlElements();
			//Destroying the base of pattern
			super.dispose();
		}
	}
}
