// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.AnimatedLabel {
	export class AnimatedLabel extends AbstractPattern<AnimatedLabelConfig> implements IAnimatedLabel {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnBlur: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnFocus: any;

		// Set the input html element
		private _inputElem: HTMLInputElement | HTMLTextAreaElement;

		// Set the inputPlaceholder html element
		private _inputPlaceholderElem: HTMLElement;

		// Flag that will be manage if the label is active
		private _isLabelActive: boolean;

		// Set the labelPlaceholder html element
		private _labelPlaceholderElem: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new AnimatedLabelConfig(configs));

			// Set the method that will be assigned to the window click event
			this._eventOnBlur = this._onInputBlur.bind(this);
			this._eventOnFocus = this._onInputFocus.bind(this);
		}

		// Add Pattern Events
		private _addEvents(): void {
			this._inputElem.addEventListener('blur', this._eventOnBlur);
			this._inputElem.addEventListener('focus', this._eventOnFocus);
		}

		// Check if the input is empty, if yes reposition the Label
		private _onInputBlur(): void {
			if (this._inputElem.value === '' && this._isLabelActive) {
				this._isLabelActive = false;
				Helper.Style.RemoveClass(this._selfElem, Enum.CssClasses.IsActive);
			}
		}

		// Add the active cssClass into the Label since content will be added into input
		private _onInputFocus(): void {
			if (this._inputElem.value === '' && !this._isLabelActive) {
				this._isLabelActive = true;
				Helper.Style.AddClass(this._selfElem, Enum.CssClasses.IsActive);
			}
		}

		// Update info based on htmlContent
		private _setHtmlElements(): void {
			this._labelPlaceholderElem = this._selfElem.querySelector('.' + Enum.CssClasses.LabelPlaceholder);
			this._inputPlaceholderElem = this._selfElem.querySelector('.' + Enum.CssClasses.InputPlaceholder);

			this._inputElem =
				this._inputPlaceholderElem.querySelector(GlobalEnum.DataBlocksTag.Input) ||
				this._inputPlaceholderElem.querySelector(GlobalEnum.DataBlocksTag.TextArea);

			// Check if the input exist
			if (this._inputElem) {
				if (this._inputElem.value) {
					this._isLabelActive = true;
					Helper.Style.AddClass(this._selfElem, Enum.CssClasses.IsActive);
				} else {
					this._isLabelActive = false;
				}
			} else {
				throw new Error(Enum.Messages.InputNotFound);
			}

			// Show a warning message if a label was in use
			if (!this._labelPlaceholderElem.querySelector(GlobalEnum.DataBlocksTag.Label)) {
				console.warn(Enum.Messages.LabelNotFound);
			}
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// Set default ExtendedClass values
			if (this._configs.ExtendedClass !== '') {
				this.UpdateExtendedClass('', this._configs.ExtendedClass);
			}
		}

		public build(): void {
			//OS takes a while to set the TextArea
			setTimeout(() => {
				super.build();

				this._setHtmlElements();

				this._setInitialCssClasses();

				this._addEvents();

				this.finishBuild();
			}, 0);
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

			this._inputElem.removeEventListener('blur', this._eventOnBlur);
			this._inputElem.removeEventListener('focus', this._eventOnFocus);
		}

		// Update Label active status accordingly when the input info has canhged
		public updateOnRender(): void {
			// Do not run this instead the pattern is totally built
			if (this.isBuilt) {
				if (this._inputElem.value === '') {
					this._isLabelActive = false;
					Helper.Style.RemoveClass(this._selfElem, Enum.CssClasses.IsActive);
				}

				if (this._inputElem.value !== '' && !this._isLabelActive) {
					this._isLabelActive = true;
					Helper.Style.AddClass(this._selfElem, Enum.CssClasses.IsActive);
				}
			}
		}
	}
}
