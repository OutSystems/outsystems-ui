// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Rating {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Rating extends AbstractPattern<RatingConfig> implements IRating {
		// Store the rating html element
		private _ratingFilledStateElem: HTMLElement;
		private _ratingHalfStateElem: HTMLElement;
		private _ratingEmptyStateElem: HTMLElement;
		private _ratingIconStatesElem: HTMLElement;
		private _ratingIconStatesId: string;
		private _ratingFieldsetElem: HTMLElement;
		private _ratingFieldsetId: string;

		// Store the placholders content
		private _clonedPlaceholders: string;

		// Keep the current input Id
		private _ratingInputId: string;

		// Store the input name to be used on clones
		private _ratingInputName: string = this.uniqueId + '-rating';

		// Store if the rating value is half
		public isHalfValue: boolean;

		// Store current decimal value
		public decimalValue: number;

		// Store current rating value
		public value: any = this.configs.RatingValue;

		// Store current disable value
		public disabled: any = !this.configs.IsEdit;

		// Store all the classes strings used by the pattern
		private _ratingCssClass = {
			IsEdit: 'is-edit',
			IsHalf: 'is-half',
			Size: 'rating-' + this.configs.Size,
			Rating: 'rating',
			RatingInput: 'rating-input',
			IconStates: 'icon-states',
			FilledState: 'rating-item-filled',
			HalfState: 'rating-item-half',
			EmptyState: 'rating-item-empty',
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new RatingConfig(configs));
		}

		// Set the html references that will be used to manage the cssClasses and atribute properties
		private _setHtmlElements(): void {
			this._ratingFilledStateElem = this._selfElem.querySelector('.' + this._ratingCssClass.FilledState);
			this._ratingHalfStateElem = this._selfElem.querySelector('.' + this._ratingCssClass.HalfState);
			this._ratingEmptyStateElem = this._selfElem.querySelector('.' + this._ratingCssClass.EmptyState);
			this._ratingIconStatesElem = this._selfElem.querySelector('.' + this._ratingCssClass.IconStates);
			this._ratingIconStatesId = Helper.Attribute.Get(this._ratingIconStatesElem, 'id');
			this._ratingFieldsetElem = this._selfElem.querySelector('fieldset');
			this._ratingFieldsetId = Helper.Attribute.Get(this._ratingFieldsetElem, 'id');
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// Set IsEdit class
			if (this.isHalfValue === true) {
				Helper.Style.AddClass(this._selfElem, this._ratingCssClass.IsHalf);
			}

			// Set IsHalf class
			if (this._configs.IsEdit === true) {
				Helper.Style.AddClass(this._selfElem, this._ratingCssClass.IsEdit);
			}

			// Set Size class
			Helper.Style.AddClass(this._selfElem, this._ratingCssClass.Size);

			// Set default ExtendedClass values
			if (this._configs.ExtendedClass !== '') {
				this.UpdateExtendedClass(this._configs.ExtendedClass, this._configs.ExtendedClass);
			}
		}

		// Disable fieldset according to IsEdit parameter
		private _setFieldsetStatus(IsEnabled: boolean): void {
			const isDisabled = this.getIsDisabled();

			if (!IsEnabled) {
				Helper.Attribute.Set(this._ratingFieldsetElem, 'disabled', 'true');
			} else if (IsEnabled && isDisabled) {
				Helper.Attribute.Remove(this._ratingFieldsetElem, 'disabled');
			}
		}

		// Method that handles the placeholders content storage and DOM lifecycle
		private _handlePlaceholders(): void {
			// Store the placholders content to cloned after
			this._clonedPlaceholders = this._ratingIconStatesElem.innerHTML;

			// After it's stored, remove the original content from the DOM
			this._ratingIconStatesElem.remove();
		}

		// Medthod that will iterate on the RatingScale, to crate an item for each one
		private _createItems(): void {
			let index = 0;

			for (var i = 0; i <= this.configs.RatingScale; i++) {
				index = i;
				this._ratingInputId = this.uniqueId + '-rating-' + index;
				this._renderItems(index);
			}
		}

		// Method called on createItems() to render the correct HTML structure for each item
		private _renderItems(index: number): void {
			const input =
				'<input ' +
				this.disabled +
				' type="radio" class="rating-input wcag-hide-text" id="' +
				this._ratingInputId +
				'" name="' +
				this._ratingInputName +
				'" value="' +
				index +
				'"/>';
			const label =
				'<label class="' +
				(index === 0 ? 'rating-item wcag-hide-text' : 'rating-item') +
				'" for="' +
				this._ratingInputId +
				'"><span class="wcag-hide-text">Rating ' +
				index +
				'</span>' +
				(index !== 0 ? this._clonedPlaceholders : '') +
				'</label>';

			this._ratingFieldsetElem.innerHTML += input + label;
		}

		// Method to add click event if IsEdit is true
		private _setClickEvent(): void {
			if (this.configs.IsEdit) {
				this._selfElem.addEventListener('click', (e) => {
					this._handleClickEvent(e);
				});
			}
		}

		// Method that handles the click event and set the new value, by checkinh the input :checked
		private _handleClickEvent(e): void {
			this.isHalfValue = false;
			const isInput = Helper.Style.ContainsClass(e.target, this._ratingCssClass.RatingInput);

			if (isInput) {
				this.value = this.getValue();
				this.setValue(this.value);
			}
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setInitialCssClasses();

			this._setFieldsetStatus(this._configs.IsEdit);

			this._handlePlaceholders();

			this._createItems();

			this._setClickEvent();

			this.setValue(this._configs.RatingValue);

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			if (Enum.Rating[propertyName] && this._configs.hasOwnProperty(propertyName)) {
				switch (propertyName) {
					case Enum.Rating.ExtendedClass:
						this.UpdateExtendedClass(this._configs.ExtendedClass, propertyValue);

						this._configs.ExtendedClass = propertyValue;

						break;
					case Enum.Rating.RatingValue:
						this.setValue(propertyValue);

						break;
					case Enum.Rating.RatingScale:
						this.setScale(propertyValue);

						break;
					case Enum.Rating.IsEdit:
						this.setIsEdit(propertyValue);

						break;
					case Enum.Rating.Size:
						this.setSize(propertyValue);

						break;
				}
			} else {
				throw new Error(`changeProperty - Property '${propertyName}' can't be changed.`);
			}
		}

		// Set a rating value
		public setValue(value: any): void {
			let newValue: number;
			this.value = value;
			this.decimalValue = this.getDecimalValue(value);
			this.isHalfValue = this.getIsHalfValue(value);
			const ratingItems = this._selfElem.querySelectorAll('input');

			if (Helper.Style.ContainsClass(this._selfElem, this._ratingCssClass.IsHalf)) {
				Helper.Style.RemoveClass(this._selfElem, this._ratingCssClass.IsHalf);
			}

			if (value !== null) {
				if (this.configs.RatingScale === 1) {
					ratingItems[1].checked = true;
					return;
				}

				newValue =
					this.isHalfValue || this.decimalValue > 0.7 ? parseInt(this.value) + 1 : parseInt(this.value);

				try {
					ratingItems[newValue].checked = true;
				} catch (e) {
					console.warn('value exceeds the scale boundaries');
					return;
				}

				this.isHalfValue
					? Helper.Style.AddClass(this._selfElem, this._ratingCssClass.IsHalf)
					: this.isHalfValue;

				this._configs.RatingValue = newValue;
				//this.onClick(this.value);
			}
		}

		// Get the rating value
		public getValue(): number {
			const inputChecked: any = this._selfElem.querySelector('input:checked');
			return parseInt(inputChecked.value);
		}

		// Get the rating decimal value
		public getDecimalValue(value: number): number {
			return Math.round((value - Math.floor(value)) * 100) / 100;
		}

		// Get if the valie is-half
		public getIsHalfValue(value: number): boolean {
			const decimalValue = this.getDecimalValue(value);
			const isHalf = decimalValue >= 0.3 && decimalValue <= 0.7 ? true : false;

			return isHalf;
		}

		// Get disabled status
		public getIsDisabled(): string {
			return Helper.Attribute.Get(this._ratingFieldsetElem, 'disabled');
		}

		// Set disabled status
		public setIsDisabled(): void {
			Helper.Attribute.Set(this._ratingFieldsetElem, 'disabled', 'true');

			this.disabled = true;
		}

		// Set a RatingScale
		public setScale(value: number): void {
			this.configs.RatingScale = value;
			this.destroy(true);
			this._createItems();
			this.setValue(this.value);
		}

		// Set the IsEdit option
		public setIsEdit(isEdit: any): void {
			this._setFieldsetStatus(isEdit);
			if (isEdit === 'True') {
				Helper.Style.AddClass(this._selfElem, this._ratingCssClass.IsEdit);
			} else {
				Helper.Style.RemoveClass(this._selfElem, this._ratingCssClass.IsEdit);
			}

			this._configs.IsEdit = isEdit;
		}

		// Set the Rating Size
		public setSize(size: string): void {
			Helper.Style.RemoveClass(this._selfElem, this._ratingCssClass.Size);
			Helper.Style.AddClass(this._selfElem, 'rating-' + size);

			this.configs.Size = size;
			this._ratingCssClass.Size = 'rating-' + size;
		}

		// Destroy the Rating pattern
		public destroy(IsUpdate: boolean): void {
			if (this._selfElem) {
				this._selfElem.removeEventListener('click', this._handleClickEvent);

				if (IsUpdate) {
					this._ratingFieldsetElem.innerHTML = '';
				}
			}
		}
	}
}
