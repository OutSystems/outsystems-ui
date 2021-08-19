// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.AnimatedLabel {
	export class AnimatedLabel extends AbstractPattern<AnimatedLabelConfig> implements IAnimatedLabel {
		// Store the pattern html elements
		private _inputElem: HTMLElement;
		private _inputPlaceholderElem: HTMLElement;
		private _labelPlaceholderElem: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new AnimatedLabelConfig(configs));
		}

		// Add Pattern Events
		private _addEvents(): void {
			console.log('Set Events here!');
		}

		// Add the Accessibility Attributes values
		private _setAccessibilityProps(): void {
			console.log('Set Accessibility attributes here!');
		}

		// Update info based on htmlContent
		private _setHtmlElements(): void {
			this._labelPlaceholderElem = this._selfElem.querySelector('.' + Enum.CssClasses.LabelPlaceholder);
			this._inputPlaceholderElem = this._selfElem.querySelector('.' + Enum.CssClasses.InputPlaceholder);

			this._inputElem =
				this._inputPlaceholderElem.querySelector(Enum.DataBlockTag.Input) ||
				this._inputPlaceholderElem.querySelector(Enum.DataBlockTag.TextArea);

			if (!this._inputElem) {
				throw new Error('Missing input or textarea.');
			}
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// Set default ExtendedClass values
			if (this._configs.ExtendedClass !== '') {
				this.UpdateExtendedClass('', this._configs.ExtendedClass);
			}

			console.log('Set all the cssClasses here if needed!');
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setInitialCssClasses();

			this._setAccessibilityProps();

			this._addEvents();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			if (Enum.Properties[propertyName] && this._configs.hasOwnProperty(propertyName)) {
				switch (propertyName) {
					case Enum.Properties.ExtendedClass:
						this.UpdateExtendedClass(this._configs.ExtendedClass, propertyValue);

						this._configs.ExtendedClass = propertyValue;

						break;
				}
			} else {
				throw new Error(`changeProperty - Property '${propertyName}' can't be changed.`);
			}
		}

		// Destroy the Animatedlabel
		public destroy(): void {
			super.destroy();

			console.log('Add all the logic to propert destroy pattern here!');
		}
	}
}
