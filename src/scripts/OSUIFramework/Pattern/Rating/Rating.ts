// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Rating {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Rating extends AbstractPattern<RatingConfig> implements IRating {
		// Store the rating html element
		private _ratingIconStatesElem: HTMLElement;
		private _ratingFieldsetElem: HTMLElement;

		// Store the placholders content
		private _clonedPlaceholders: string;

		// Store the input name to be used on clones
		private _ratingInputName: string = 'rating-' + this.uniqueId;

		// Store if the rating already has an event added
		private _ratingHasEventAdded: boolean = false;

		// Store if the rating value is half
		public isHalfValue: boolean;

		// Store current decimal value
		public decimalValue: number;

		// Store current rating value
		public value: any = this.configs.RatingValue;

		// Store current disable value
		public disabled: any = !this.configs.IsEdit;

		// Store the callback to be used on the OnSelect event
		public onSelect: any = null;

		// Store all the classes strings used by the pattern
		private _ratingCssClass = {
			IsEdit: 'is-edit',
			IsHalf: 'is-half',
			Size: 'rating-' + this.configs.Size,
			Rating: 'rating',
			RatingInput: 'rating-input',
			RatingItem: 'rating-item',
			IconStates: 'icon-states',
			FilledState: 'rating-item-filled',
			HalfState: 'rating-item-half',
			EmptyState: 'rating-item-empty',
			WCAGHideText: 'wcag-hide-text',
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new RatingConfig(configs));
		}

		// Set the html references that will be used to manage the cssClasses and atribute properties
		private _setHtmlElements(): void {
			this._ratingIconStatesElem = this._selfElem.querySelector('.' + this._ratingCssClass.IconStates);
			this._ratingFieldsetElem = this._selfElem.querySelector('fieldset');
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
			if (this._configs.Size !== '') {
				Helper.Style.AddClass(this._selfElem, this._ratingCssClass.Size);
			}

			// Set default ExtendedClass values
			if (this._configs.ExtendedClass !== '') {
				this.UpdateExtendedClass(this._configs.ExtendedClass, this._configs.ExtendedClass);
			}
		}

		// Toggle fieldset disbaled status
		private _setFieldsetDisabledStatus(IsDisabled: boolean): void {
			const isFieldsetDisabled = Helper.Attribute.Get(this._ratingFieldsetElem, 'disabled');

			if (IsDisabled) {
				Helper.Attribute.Set(this._ratingFieldsetElem, 'disabled', 'true');
			} else if (!IsDisabled && isFieldsetDisabled) {
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
				// Store index to be used on the _renderItems method
				index = i;
				this._renderItems(index);
			}
		}

		// Method called on createItems() to render the correct HTML structure for each item
		private _renderItems(index: number): void {
			// If first input, whihc is hidden, than also hide the label
			const hideLabelClass: string = index === 0 ? this._ratingCssClass.WCAGHideText : '';
			// if not first input, which is hidden, add the html stored form the placeholders
			const labelHTML: any = index !== 0 ? this._clonedPlaceholders : '';
			// Create a unique rating input id, based on the index
			const ratingInputId: string = this.uniqueId + '-rating-' + index;

			// Craete input and label html
			const input = `<input type="radio" class="${this._ratingCssClass.RatingInput} ${this._ratingCssClass.WCAGHideText}" id=${ratingInputId} name=${this._ratingInputName} value=${index}/>`;
			const label = `<label class='${this._ratingCssClass.RatingItem} ${hideLabelClass}' for=${ratingInputId}><span class="${this._ratingCssClass.WCAGHideText}">Rating ${index}</span>${labelHTML}</label>`;

			// Append new input + label to fieldset's html
			this._ratingFieldsetElem.innerHTML += input + label;
		}

		// Method to manage the click event
		private _manageRatingEvent(): void {
			// Check if a event was already added
			if (this._ratingHasEventAdded) {
				// If true, remove event
				this._selfElem.removeEventListener('click', this._ratingOnClick);

				// And set variable as false
				this._ratingHasEventAdded = false;
			} else if (this.configs.IsEdit) {
				// Otherwise, if there is no event already added and the param IsEdit is true, add new event
				this._selfElem.addEventListener('click', (e) => {
					this._ratingOnClick(e);
				});
				// And set variable as true
				this._ratingHasEventAdded = true;
			}
		}

		// Method that handles the click event and set the new value, by checking the input:checked
		private _ratingOnClick(e): void {
			// Remove the is-half when clicking, as a click will never result in a half value
			this.isHalfValue = false;
			// Check if the e.target is a label with the this._ratingCssClass.RatingInput class
			const isInput = Helper.Style.ContainsClass(e.target, this._ratingCssClass.RatingInput);

			if (isInput) {
				// If it is, then get the input:checked value
				this.value = this.getValue();
				// And use that value to set a new Rating Value
				this.setValue(this.value);
			}
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setInitialCssClasses();

			this._handlePlaceholders();

			this._setFieldsetDisabledStatus(!this._configs.IsEdit);

			this._createItems();

			this._manageRatingEvent();

			this.setValue(this._configs.RatingValue);

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			if (Enum.Rating[propertyName] && this._configs.hasOwnProperty(propertyName)) {
				// Check which property changed and call respective method to update it
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

		public registerCallback(callback: any): void {
			this.onSelect = (param, ...args) => {
				callback(param, ...args);
			};
		}

		// Set a rating value
		public setValue(value: any): void {
			if (value !== null) {
				// Format value to be of type decimal number
				value = parseFloat(value);
				// Store the new value to be defined
				let newValue: number;
				// Check if passed value is decimal
				this.decimalValue = this.getDecimalValue(value);
				// Check if passed value is half
				this.isHalfValue = this.getIsHalfValue(value);
				// Get all inputs on rating, to properly add the :checked attribute on the correct one
				const ratingItems = this._selfElem.querySelectorAll('input');

				// Reset the is-half class
				if (Helper.Style.ContainsClass(this._selfElem, this._ratingCssClass.IsHalf)) {
					Helper.Style.RemoveClass(this._selfElem, this._ratingCssClass.IsHalf);
				}

				// If there's only one rating item, then there's no need for further checks, this one will be checked
				if (this.configs.RatingScale === 1) {
					ratingItems[1].checked = true;
					return;
				}

				// Set the newValue const to the correct value
				// If is-half or the decimal value is bigger than 0.7, that means that we will have to apply the :checked attribute on the next input
				// Otherwise, the input :checked will correspond to the one clicked.
				newValue = this.isHalfValue || this.decimalValue > 0.7 ? parseInt(value) + 1 : parseInt(value);

				// Try if the input :checked exists, otherwise throw warn for trying to set a value bigger than the limit
				try {
					ratingItems[newValue].checked = true;
				} catch (e) {
					console.warn(`Value of Rating '${this.uniqueId}' exceeds the scale boundaries`);
					return;
				}

				// If is-half add the appropriate class, otherwise just declare the this.isHalfValue, to complete the if statement
				this.isHalfValue
					? Helper.Style.AddClass(this._selfElem, this._ratingCssClass.IsHalf)
					: this.isHalfValue;

				// Update the variables with the new value
				this._configs.RatingValue = this.isHalfValue ? value : newValue;
				this.value = this._configs.RatingValue;

				// Call calbackfor OnSelect event
				if (this.onSelect !== null) {
					this.onSelect(this.value);
				}
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
			// If bigger than 0.3 and lower than 0.7 means it should be represented as a half value.
			// This threshold was decided by UX principles
			const isHalf = decimalValue >= 0.3 && decimalValue <= 0.7 ? true : false;

			return isHalf;
		}

		// Get disabled status
		public getIsDisabled(): string {
			return this.disabled;
		}

		// Set disabled status
		public setIsDisabled(isDisabled: boolean): void {
			this._setFieldsetDisabledStatus(isDisabled);

			this.disabled = isDisabled;
		}

		// Set a RatingScale
		public setScale(value: number): void {
			// Update configs
			this.configs.RatingScale = value;
			// Call destroy, so that the html is deleted
			this.destroy();
			// Afteer the fieldset html is clean, create the items again
			this._createItems();
			// Set the rating value equal to the value before calling the setScale method
			this.setValue(this.value);
		}

		// Set the IsEdit option
		public setIsEdit(isEdit: any): void {
			// Make sure that the param value is boolean and not a string
			// This needs to be done, for compatibility with OutSystems platform logic
			const IsEditParam = isEdit === 'True' ? true : false;

			// Set the fieldset and input disabled attribute status
			this.setIsDisabled(!IsEditParam);
			// Update the config
			this._configs.IsEdit = IsEditParam;

			// Toggle the is-edit class
			IsEditParam
				? Helper.Style.AddClass(this._selfElem, this._ratingCssClass.IsEdit)
				: Helper.Style.RemoveClass(this._selfElem, this._ratingCssClass.IsEdit);

			// Review if there's a need to add/remove the click event, accordingly to the IsEdit value
			this._manageRatingEvent();
		}

		// Set the Rating Size
		public setSize(size: string): void {
			let newSize: string;

			// Reset current class
			Helper.Style.RemoveClass(this._selfElem, this._ratingCssClass.Size);

			// If size param is not empty, it means is either 'small' or 'medium', so we can add the class based on the size param
			// This is done, as the Size entity in OutSystems has not a 'base' entity, just a NullIdentifier, which is the default size
			if (size !== '') {
				Helper.Style.AddClass(this._selfElem, 'rating-' + size);

				newSize = 'rating-' + size;
			} else {
				// If it's empty, it means is the default NullIdentifier, whihch corresponds to the 'base' size
				newSize = 'rating-base';
			}

			// Update the config
			this.configs.Size = newSize;
			this._ratingCssClass.Size = newSize;
		}

		// Destroy the Rating pattern
		public destroy(): void {
			// call super method, which deletes this rating class instance from the RatingMap
			super.destroy();

			// remove event listener if any was added
			if (this._ratingHasEventAdded) {
				this._selfElem.removeEventListener('click', this._ratingOnClick);
			}

			// Remove html from the fieldset
			this._ratingFieldsetElem.innerHTML = '';
		}
	}
}
