// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Spinner {
	/**
	 * Class that implements the Spinner pattern.
	 * The glyph markup (one <svg> per animation type) and the accessible name are authored in the block;
	 * the pattern applies the type and size modifier classes and the colour override.
	 *
	 * @export
	 * @class Spinner
	 * @extends {AbstractPattern<SpinnerConfig>}
	 * @implements {ISpinner}
	 */
	export class Spinner extends AbstractPattern<SpinnerConfig> implements ISpinner {
		// Size modifier class currently applied
		private _sizeClass = '';
		// Animation type modifier class currently applied
		private _typeClass = '';

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SpinnerConfig(configs));
		}

		// Theme colour names stay a var() so they follow the theme (and dark mode); anything else is used as-is
		private _setColor(): void {
			if (this.configs.Color === '') {
				Helper.Dom.Styles.RemoveStyleAttribute(this.selfElement, Enum.CssProperty.Color);
			} else {
				Helper.Dom.Styles.SetStyleAttribute(
					this.selfElement,
					Enum.CssProperty.Color,
					Helper.Dom.Styles.GetColorCssValueFromColorType(this.configs.Color)
				);
			}
		}

		// Applies the size modifier class
		private _setSize(): void {
			const sizeClass = Enum.CssClass.ModifierPrefix + this.configs.Size;

			Helper.Dom.Styles.ExtendedClass(this.selfElement, this._sizeClass, sizeClass);
			this._sizeClass = sizeClass;
		}

		// Applies the animation type modifier class ("default" is resolved by CSS: lines on iOS, circular elsewhere)
		private _setType(): void {
			const typeClass = Enum.CssClass.ModifierPrefix + this.configs.AnimationType;

			Helper.Dom.Styles.ExtendedClass(this.selfElement, this._typeClass, typeClass);
			this._typeClass = typeClass;
		}

		/**
		 * Sets the accessibility role. The accessible name (aria-label) is a translatable literal in the block.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Spinner.Spinner
		 */
		protected setA11YProperties(): void {
			Helper.A11Y.RoleProgressBar(this.selfElement);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Spinner.Spinner
		 */
		protected setCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Makes sure the pattern root has its base class.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Spinner.Spinner
		 */
		protected setHtmlElements(): void {
			Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.Pattern);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Spinner.Spinner
		 */
		protected unsetCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Undoes everything build() added: modifier classes, inline colour and the role.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Spinner.Spinner
		 */
		protected unsetHtmlElements(): void {
			// The platform may already have removed the DOM when the block is destroyed
			if (this.selfElement) {
				Helper.Dom.Styles.ExtendedClass(this.selfElement, `${this._sizeClass} ${this._typeClass}`, '');
				Helper.Dom.Styles.RemoveStyleAttribute(this.selfElement, Enum.CssProperty.Color);
				Helper.Dom.Attribute.Remove(this.selfElement, Constants.A11YAttributes.Role.AttrName);
			}
		}

		/**
		 * Builds the Spinner.
		 *
		 * @memberof OSFramework.Patterns.Spinner.Spinner
		 */
		public build(): void {
			super.build();

			this.setHtmlElements();
			this._setSize();
			this._setType();
			this._setColor();
			this.setA11YProperties();

			this.finishBuild();
		}

		/**
		 * Applies the changes of state/value of the configurations.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof OSFramework.Patterns.Spinner.Spinner
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.AnimationType:
						this._setType();
						break;
					case Enum.Properties.Color:
						this._setColor();
						break;
					case Enum.Properties.Size:
						this._setSize();
						break;
				}
			}
		}

		/**
		 * Disposes the current pattern.
		 *
		 * @memberof OSFramework.Patterns.Spinner.Spinner
		 */
		public dispose(): void {
			this.unsetHtmlElements();
			super.dispose();
		}
	}
}
