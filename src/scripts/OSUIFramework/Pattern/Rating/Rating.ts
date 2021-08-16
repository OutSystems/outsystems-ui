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
		private _ratingInputName: string = this.widgetId + 'rating';
		// Store if the rating value is half
		private _IsHalfValue: boolean;
		// Store current decimal value
		private _ratingDecimalValue: number;
		// Store current rating value
		private _ratingValue: any = this.configs.RatingValue;

		// Store all the classes strings used by the pattern
		private _ratingCssClass = {
			IsEdit: 'is-edit',
			IsHalf: 'is-half',
			Size: 'rating-' + this.configs.Size,
			Rating: 'rating',
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

		private _handlePlaceholders(): void {
			// Store the placholders content to cloned after
			this._clonedPlaceholders = this._ratingIconStatesElem.innerHTML;
			// After it's stored, remove the original content from the DOM
			this._ratingIconStatesElem.remove();
		}

		private _createItems(): void {
			let index = 0;

			for (var i = 0; i <= this.configs.RatingScale; i++) {
				index = i;
				this._ratingInputId = this.widgetId + '-rating-' + index;
				this._renderItems(index);
			}
		}

		private _renderItems(index: number): void {
			const input = '<input ' + this.getIsDisabled();
			+' type="radio" class="rating-input wcag-hide-text" id="' +
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

		private _setClickEvent(): void {
			if (this.configs.IsEdit) {
				this._selfElem.addEventListener('click', (e) => {
					this._handleClickEvent(e);
				});
			}
		}

		private _handleClickEvent(e): void {
			this._IsHalfValue = false;

			if (e.target.classList.contains('rating-input')) {
				this._ratingValue = this.getValue();
				this.setValue(this._ratingValue);
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
				}
			} else {
				throw new Error(`changeProperty - Property '${propertyName}' can't be changed.`);
			}
		}

		// Set a rating value
		public setValue(value: number): void {
			let newValue: number;
			this._ratingValue = value;
			this._ratingDecimalValue = this.getDecimalValue(value);
			this._IsHalfValue = this.getIsHalfValue(value);
			const ratingItems = this._selfElem.querySelectorAll('input');

			if (this._selfElem.classList.contains('is-half')) {
				this._selfElem.classList.remove('is-half');
			}

			if (this._ratingValue !== null) {
				if (this.configs.RatingScale === 1) {
					ratingItems[1].checked = true;
					return;
				}

				newValue =
					this._IsHalfValue || this._ratingDecimalValue > 0.7
						? parseInt(this._ratingValue + 1)
						: parseInt(this._ratingValue);

				try {
					ratingItems[newValue].checked = true;
				} catch (e) {
					console.warn('value exceeds the scale boundaries');
					return;
				}

				this._IsHalfValue ? this._selfElem.classList.add('is-half') : this._IsHalfValue;

				//this.onClick(this.value);
			}
		}

		// Get the rating value
		public getValue(): number {
			return 1;
		}

		// Get the rating decimal value
		public getDecimalValue(value: number): number {
			return 1;
		}

		// Get if the valie is-half
		public getIsHalfValue(value: number): boolean {
			return true;
		}

		// Get disabled status
		public getIsDisabled(): string {
			return Helper.Attribute.Get(this._ratingFieldsetElem, 'disabled');
		}

		// Set disabled status
		public setIsDisabled(): void {
			Helper.Attribute.Set(this._ratingFieldsetElem, 'disabled', 'true');
		}
	}
}
