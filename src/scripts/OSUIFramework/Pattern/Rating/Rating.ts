// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Rating {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Rating extends AbstractPattern<RatingConfig> implements IRating {
		// Store the placholders content
		private _clonedPlaceholders: string;
		// Store current decimal value
		private _decimalValue: number;
		// Store current disable values
		private _disabled: boolean;
		// Store the click event with bind(this)
		private _eventOnRatingClick: Callbacks.Generic;
		// Store if the rating value is half
		private _isHalfValue: boolean;
		// Store the callback to be used on the OnSelect event
		private _onSelect: Callbacks.OSRatingSelectEvent;
		// Store the fieldset html element
		private _ratingFieldsetElem: HTMLElement;
		// Store if the rating already has an event added
		private _ratingHasEventAdded: boolean;
		// Store the rating icons html element
		private _ratingIconStatesElem: HTMLElement;
		// Store the input name to be used on clones
		private _ratingInputName: string;
		// Store current rating value
		private _value: number;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new RatingConfig(configs));

			this._value = this.configs.RatingValue;
			this._disabled = !this.configs.IsEdit;
			this._ratingInputName = 'rating-' + this.uniqueId;
			this._ratingHasEventAdded = false;
			this._eventOnRatingClick = this._ratingOnClick.bind(this);
		}

		// Medthod that will iterate on the RatingScale, to crate an item for each one
		private _createItems(): void {
			for (let i = 0; i <= this.configs.RatingScale; i++) {
				// Store index to be used on the _renderItem method
				this._renderItem(i);
			}
		}

		// Method that handles the placeholders content storage and DOM lifecycle
		private _handlePlaceholders(): void {
			// Store the placholders content to cloned after
			this._clonedPlaceholders = this._ratingIconStatesElem.innerHTML;

			// After it's stored, remove the original content from the DOM
			this._ratingIconStatesElem.remove();
		}

		// Method to manage the click event
		private _manageRatingEvent(): void {
			// Check if a event was already added
			if (this._ratingHasEventAdded) {
				// If true, remove event
				this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnRatingClick);

				// And set variable as false
				this._ratingHasEventAdded = false;
			} else if (this.configs.IsEdit) {
				// Otherwise, if there is no event already added and the param IsEdit is true, add new event
				this._selfElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnRatingClick);
				// And set variable as true
				this._ratingHasEventAdded = true;
			}
		}

		// Method that handles the click event and set the new value, by checking the input:checked
		private _ratingOnClick(e: MouseEvent): void {
			const currentTarget: HTMLElement = e.target as HTMLElement;
			// Remove the is-half when clicking, as a click will never result in a half value
			this._isHalfValue = false;

			// Check if the e.target is a label with the Enum.RatingCssClass.RatingInput class
			const isInput = Helper.Dom.Styles.ContainsClass(currentTarget, Enum.CssClass.RatingInput);
			if (isInput) {
				// If it is, then get the input:checked value
				this._value = this.getValue();
				// And use that value to set a new Rating Value
				this.setValue(this._value, true);
			}
		}

		// Method called on createItems() to render the correct HTML structure for each item
		private _renderItem(index: number): void {
			// If first input, whihc is hidden, than also hide the label
			const hideLabelClass: string = index === 0 ? Enum.CssClass.WCAGHideText : '';
			// if not first input, which is hidden, add the html stored form the placeholders
			const labelHTML = index !== 0 ? this._clonedPlaceholders : '';
			// Create a unique rating input id, based on the index
			const ratingInputId: string = this.uniqueId + '-rating-' + index;

			// Craete input and label html
			const input = `<input type="radio" class="${Enum.CssClass.RatingInput} ${Enum.CssClass.WCAGHideText}" id=${ratingInputId} name=${this._ratingInputName} value=${index}/>`;
			const label = `<label class='${Enum.CssClass.RatingItem} ${hideLabelClass}' for=${ratingInputId}><span class="${Enum.CssClass.WCAGHideText}">Rating ${index}</span>${labelHTML}</label>`;

			// Append new input + label to fieldset's html
			this._ratingFieldsetElem.innerHTML += input + label;
		}

		// Toggle fieldset disbaled status
		private _setFieldsetDisabledStatus(isDisabled: boolean): void {
			const isFieldsetDisabled = Helper.Dom.Attribute.Get(this._ratingFieldsetElem, 'disabled');

			if (isDisabled) {
				Helper.Dom.Attribute.Set(this._ratingFieldsetElem, 'disabled', 'true');
			} else if (!isDisabled && isFieldsetDisabled) {
				Helper.Dom.Attribute.Remove(this._ratingFieldsetElem, 'disabled');
			}
		}

		// Set the html references that will be used to manage the cssClasses and atribute properties
		private _setHtmlElements(): void {
			this._ratingIconStatesElem = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.IconStates);
			this._ratingFieldsetElem = this._selfElem.querySelector(GlobalEnum.HTMLElement.FieldSet);
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// Set IsHalf class
			if (this._isHalfValue) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsHalf);
			}

			// Set IsEdit class
			if (this._configs.IsEdit) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsEdit);
			}

			// Set Size class
			if (this._configs.Size !== '') {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.Size + this._configs.Size);
			}
		}

		// Method that triggers the OnSelect event
		private _triggerOnSelectEvent(value: number): void {
			if (this._onSelect !== undefined) {
				Helper.AsyncInvocation(this._onSelect, this.widgetId, value);
			}
		}

		/**
		 * Building Rating
		 *
		 * @memberof Rating
		 */
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

		/**
		 * Update value when a parameters changed occurs
		 *
		 * @param {string} propertyName
		 * @param {*} propertyValue
		 * @memberof Rating
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			//Storing the current Size, before possibly changing this property.
			//This will enable us to remove the previous added classes to the element.
			const oldSize = this.configs.Size;

			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.RatingValue:
						this.setValue(propertyValue as number);
						break;

					case Enum.Properties.RatingScale:
						this.setScale();
						break;

					case Enum.Properties.IsEdit:
						this.setIsEdit();
						break;

					case Enum.Properties.Size:
						this.setSize(oldSize);
						break;
				}
			}
		}

		/**
		 * Destroy the Rating pattern
		 *
		 * @memberof Rating
		 */
		public dispose(): void {
			// call super method, which deletes this rating class instance from the RatingMap
			super.dispose();

			// remove event listener if any was added
			if (this._selfElem && this._ratingHasEventAdded) {
				this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnRatingClick);
			}

			// Remove html from the fieldset
			this._ratingFieldsetElem.innerHTML = '';
		}

		/**
		 * Get the rating decimal value
		 *
		 * @param {number} value
		 * @return {*}  {number}
		 * @memberof Rating
		 */
		// jRio: why is this public?
		public getDecimalValue(value: number): number {
			return Math.round((value - Math.floor(value)) * 100) / 100;
		}

		/**
		 * Get disabled status
		 *
		 * @return {*}  {boolean}
		 * @memberof Rating
		 */
		// jRio: why is this public?
		public getIsDisabled(): boolean {
			return this._disabled;
		}

		/**
		 * Get if the valie is-half
		 *
		 * @param {number} value
		 * @return {*}  {boolean}
		 * @memberof Rating
		 */
		// jRio: why is this public?
		public getIsHalfValue(value: number): boolean {
			const decimalValue = this.getDecimalValue(value);
			// If bigger than 0.3 and lower than 0.7 means it should be represented as a half value.
			// This threshold was decided by UX principles
			return !!(decimalValue >= 0.3 && decimalValue <= 0.7);
		}

		/**
		 * Get the rating value
		 *
		 * @return {*}  {number}
		 * @memberof Rating
		 */
		// jRio: why is this public?
		public getValue(): number {
			const inputChecked: HTMLInputElement = this._selfElem.querySelector('input:checked');
			return parseInt(inputChecked.value);
		}

		/**
		 * Set callbacks for the onSelect click event
		 *
		 * @param {Callbacks.OSRatingSelectEvent} callback
		 * @memberof Rating
		 */
		public registerCallback(callback: Callbacks.OSRatingSelectEvent): void {
			this._onSelect = callback;
		}

		/**
		 * Set disabled status
		 *
		 * @param {boolean} isDisabled
		 * @memberof Rating
		 */
		// jRio: why is this public?
		public setIsDisabled(isDisabled: boolean): void {
			this._setFieldsetDisabledStatus(isDisabled);

			this._disabled = isDisabled;
		}

		/**
		 * Set the IsEdit option
		 *
		 * @memberof Rating
		 */
		// jRio: why is this public?
		public setIsEdit(): void {
			// Set the fieldset and input disabled attribute status
			this.setIsDisabled(!this.configs.IsEdit);

			// Toggle the is-edit class
			this.configs.IsEdit
				? Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsEdit)
				: Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.IsEdit);

			// Review if there's a need to add/remove the click event, accordingly to the IsEdit value
			this._manageRatingEvent();
		}

		/**
		 * Set a RatingScale
		 *
		 * @memberof Rating
		 */
		public setScale(): void {
			// Call destroy, so that the html is deleted
			this.dispose();
			// Afteer the fieldset html is clean, create the items again
			this._createItems();
			// Set the rating value equal to the value before calling the setScale method
			this.setValue(this._value);
		}

		/**
		 * Set the Rating Size
		 *
		 * @param {string} oldSize
		 * @memberof Rating
		 */
		// jRio: why is this public?
		public setSize(oldSize: string): void {
			// Reset current class
			if (oldSize !== '') {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.Size + oldSize);
			}

			// If updateSize param is not empty, it means is either 'small' or 'medium', so we can add the class based on the updateSize param
			if (this.configs.Size !== '') {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.Size + this.configs.Size);
			}
		}

		/**
		 * Set a rating value
		 *
		 * @param {number} value
		 * @param {boolean} [triggerEvent=true]
		 * @return {*}  {void}
		 * @memberof Rating
		 */
		// jRio: why is this public?
		public setValue(value: number, triggerEvent = false): void {
			if (value !== null) {
				// Check if passed value is decimal
				this._decimalValue = this.getDecimalValue(value);
				// Check if passed value is half
				this._isHalfValue = this.getIsHalfValue(value);
				// Get all inputs on rating, to properly add the :checked attribute on the correct one
				const ratingItems = this._selfElem.querySelectorAll(GlobalEnum.HTMLElement.Input);

				// Reset the is-half class
				if (Helper.Dom.Styles.ContainsClass(this._selfElem, Enum.CssClass.IsHalf)) {
					Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.IsHalf);
				}

				// If there's only one rating item, then there's no need for further checks, this one will be checked
				if (this.configs.RatingScale === 1) {
					ratingItems[1].checked = true;
					return;
				}

				// Set the newValue const to the correct value
				// If is-half or the decimal value is bigger than 0.7, that means that we will have to apply the :checked attribute on the next input
				// Otherwise, the input :checked will correspond to the one clicked.
				const newValue =
					this._isHalfValue || this._decimalValue > 0.7 ? Math.floor(value) + 1 : Math.floor(value);

				// Try if the input :checked exists, otherwise throw warn for trying to set a value bigger than the limit
				try {
					ratingItems[newValue].checked = true;
				} catch (e) {
					console.warn(`Value of Rating '${this.uniqueId}' exceeds the scale boundaries`);
					return;
				}

				// If is-half add the appropriate class, otherwise just declare the this.isHalfValue, to complete the if statement
				this._isHalfValue
					? Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsHalf)
					: this._isHalfValue;

				// Update the variables with the new value
				this._configs.RatingValue = this._isHalfValue ? value : newValue;
				this._value = this._configs.RatingValue;

				// Call calbackfor OnSelect event
				if (triggerEvent) {
					this._triggerOnSelectEvent(this._value);
				}
			}
		}
	}
}
