// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Rating {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Rating extends AbstractPattern<RatingConfig> implements IRating {
		// Store the placholders content
		private _clonedPlaceholders: HTMLElement[];
		// Store current decimal value
		private _decimalValue: number;
		// Store current disable values
		private _disabled: boolean;
		// Store the click event with bind(this)
		private _eventOnRatingClick: GlobalCallbacks.Generic;
		// Store the keyup event
		private _eventOnRatingInputKeyup: GlobalCallbacks.Generic;
		// Store if the rating value is half
		private _isHalfValue: boolean;
		// Store the callback to be used on the OnSelect event
		private _platformEventOnSelect: GlobalCallbacks.OSGeneric;
		// Store the fieldset html element
		private _ratingFieldsetElem: HTMLElement;
		// Store the rating icons html element
		private _ratingIconStatesElem: HTMLElement;
		// Store the input name to be used on clones
		private _ratingInputName: string;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new RatingConfig(configs));
		}

		/**
		 * Method that will iterate on the RatingScale, to crate an item for each one
		 *
		 * @private
		 * @memberof Rating
		 */
		private _createItems(): void {
			// Check if the the we should limit the amount of items
			if (this.configs.RatingScale > Enum.Properties.MaxRatingScale) {
				this.configs.RatingScale = Enum.Properties.MaxRatingScale;

				console.warn(
					`The value of the RatingScale property on the '${this.widgetId}' Rating is higher than supported (${Enum.Properties.MaxRatingScale}).`
				);
			}

			// Create star items!
			for (let i = 0; i <= this.configs.RatingScale; i++) {
				// Store index to be used on the _renderItem method
				this._renderItem(i);
			}
		}

		/**
		 * Method to get the rating decimal value
		 *
		 * @private
		 * @param {number} value
		 * @return {*}  {number}
		 * @memberof Rating
		 */
		private _getDecimalValue(value: number): number {
			return Math.round((value - Math.floor(value)) * 100) / 100;
		}

		/**
		 * Method to get if the valie is-half
		 *
		 * @private
		 * @param {number} value
		 * @return {*}  {boolean}
		 * @memberof Rating
		 */
		private _getIsHalfValue(value: number): boolean {
			const decimalValue = this._getDecimalValue(value);
			// If bigger than 0.3 and lower than 0.7 means it should be represented as a half value.
			// This threshold was decided by UX principles
			return !!(decimalValue >= 0.3 && decimalValue <= 0.7);
		}

		/**
		 * Method to get the rating value
		 *
		 * @private
		 * @return {*}  {number}
		 * @memberof Rating
		 */
		private _getValue(): number {
			const inputChecked = Helper.Dom.TagSelector(this.selfElement, 'input:checked') as HTMLInputElement;
			return parseInt(inputChecked.value);
		}

		/**
		 * Method that handles the placeholders content storage and DOM lifecycle
		 *
		 * @private
		 * @memberof Rating
		 */
		private _handlePlaceholders(): void {
			// Store the placholders content to cloned after
			this._clonedPlaceholders = Array.from(this._ratingIconStatesElem.children) as HTMLElement[];

			// After it's stored, remove the original content from the DOM
			this._ratingIconStatesElem.remove();
		}

		/**
		 * Method used to set the keyboard keydown event
		 *
		 * @private
		 * @param {KeyboardEvent} e event
		 * @memberof Rating
		 */
		private _ratingInputOnKeyup(e: KeyboardEvent): void {
			// Ensure keys pressed are arrows
			if (
				e.key === GlobalEnum.Keycodes.ArrowUp ||
				e.key === GlobalEnum.Keycodes.ArrowRight ||
				e.key === GlobalEnum.Keycodes.ArrowDown ||
				e.key === GlobalEnum.Keycodes.ArrowLeft
			) {
				/* Block the default borwser behaviour!
					- This is needed in order to avoid let user be able to select a star when IsEdit=False,
				by default and since pattern will not be disabled, arrow keys are used to navigate through a 
				group of checkbox elements, on this case we must block this native behaviour!  */
				e.preventDefault();
			}
		}

		/**
		 * Method that handles the click event and set the new value, by checking the input:checked
		 *
		 * @private
		 * @param {MouseEvent}
		 * @memberof Rating
		 */
		private _ratingOnClick(e: MouseEvent): void {
			const currentTarget = e.target as HTMLElement;
			// Remove the is-half when clicking, as a click will never result in a half value
			this._isHalfValue = false;

			// Check if the e.target is a label with the Enum.RatingCssClass.RatingInput class
			const isInput = Helper.Dom.Styles.ContainsClass(currentTarget, Enum.CssClass.RatingInput);
			if (isInput) {
				const _lastChosen = this.selfElement.querySelectorAll(GlobalEnum.HTMLElement.Input)[
					this.configs.RatingValue
				];
				if (_lastChosen) {
					_lastChosen.ariaChecked = Constants.A11YAttributes.States.False;
					Helper.Dom.Attribute.Remove(_lastChosen, Constants.FocusableTabIndexDefault);
				}

				// If it is, then get the input:checked value
				this.configs.RatingValue = this._getValue();
				// And use that value to set a new Rating Value
				this._setValue(true);
			}
		}

		/**
		 * Method called on createItems() to render the correct HTML structure for each item
		 *
		 * @private
		 * @param {number} index
		 * @memberof Rating
		 */
		private _renderItem(index: number): void {
			// if not first input, which is hidden, add the html stored form the placeholders
			const labelHTML = index !== 0 ? this._updateClonePlaceholdersAttrs(index) : '';

			// Create a unique rating input id, based on the index
			const ratingInputId: string = this.uniqueId + '-rating-' + index;

			// Create input and label html
			const input = `<input type="${GlobalEnum.HTMLElement.Radio}" class="${Enum.CssClass.RatingInput} ${Enum.CssClass.WCAGHideText}" id=${ratingInputId} name=${this._ratingInputName} value=${index}>`;

			let label = '';
			if (!this.configs.IsEdit) {
				label = `<label class='${Enum.CssClass.RatingItem}' for=${ratingInputId}><span class="${Enum.CssClass.WCAGHideText}">Rating ${index}</span>${labelHTML}</label>`;
			} else {
				label = `<label class='${Enum.CssClass.RatingItem}' for=${ratingInputId}><span class="${Enum.CssClass.WCAGHideText}">Rating ${index}</span>${labelHTML}</label>`;
			}

			// Append new input + label to fieldset's html
			this._ratingFieldsetElem.innerHTML += input + label;
		}

		/**
		 * Method that will add the needed events
		 *
		 * @private
		 * @memberof Rating
		 */
		private _setEvents(): void {
			if (this.configs.IsEdit) {
				// Otherwise, if there is no event already added and the param IsEdit is true, add new event
				this.selfElement.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnRatingClick);
			}

			// Manage RatingInput elements events accordingly
			this._toggleRatingInputsEvents(!this.configs.IsEdit);
		}

		/**
		 * Method to toggle fieldset disbaled status
		 *
		 * @private
		 * @param {boolean} isDisabled
		 * @memberof Rating
		 */
		private _setFieldsetDisabledStatus(isDisabled: boolean): void {
			const isFieldsetDisabled = Helper.Dom.Attribute.Get(
				this._ratingFieldsetElem,
				GlobalEnum.HTMLAttributes.Disabled
			);

			if (isDisabled) {
				Helper.Dom.Attribute.Set(
					this._ratingFieldsetElem,
					GlobalEnum.HTMLAttributes.Disabled,
					Constants.A11YAttributes.States.True
				);
			} else if (!isDisabled && isFieldsetDisabled) {
				Helper.Dom.Attribute.Remove(this._ratingFieldsetElem, GlobalEnum.HTMLAttributes.Disabled);
			}
		}

		/**
		 * Method to set the cssClasses that should be assigned to the element on it's initialization
		 *
		 * @private
		 * @memberof Rating
		 */
		private _setInitialCssClasses(): void {
			// Set IsHalf class
			if (this._isHalfValue) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsHalf);
			}

			// Set IsEdit class
			if (this.configs.IsEdit) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsEdit);
			}

			// Set Size class
			if (this.configs.Size !== '') {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.Size + this.configs.Size);
			}
		}

		/**
		 * Method to set the initial and local properties values
		 *
		 * @private
		 * @memberof Rating
		 */
		private _setInitialPropertiesValues(): void {
			this._ratingInputName = 'rating-' + this.uniqueId;
		}

		/**
		 * Method to set disabled status
		 *
		 * @private
		 * @param {boolean} isDisabled
		 * @memberof Rating
		 */
		private _setIsDisabled(isDisabled: boolean): void {
			this._disabled = isDisabled;
			this._setFieldsetDisabledStatus(isDisabled);

			if (isDisabled) {
				this._unsetEvents();
			} else {
				this._setEvents();
			}
		}

		/**
		 * Method to set the IsEdit option
		 *
		 * @private
		 * @memberof Rating
		 */
		private _setIsEdit(): void {
			// Toggle the is-edit class
			if (this.configs.IsEdit) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsEdit);
			} else {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.IsEdit);
			}

			// Review if there's a need to add/remove the click event, accordingly to the IsEdit value
			if (this.configs.IsEdit) {
				this._setEvents();
			} else {
				this._unsetEvents();
			}
		}

		/**
		 * Method to set a RatingScale - The amout of stars pattern will have
		 *
		 * @private
		 * @memberof Rating
		 */
		private _setScale(): void {
			// Clean (if already exist) old Stars inside pattern
			this._ratingFieldsetElem.innerHTML = '';
			// Afteer the fieldset html is clean, create the items again
			this._createItems();
			// Set the rating value equal to the value before calling the _setScale method
			this._setValue();
		}

		/**
		 * Method to set the Rating Size
		 *
		 * @private
		 * @param {string} oldSize
		 * @memberof Rating
		 */
		private _setSize(oldSize: string): void {
			// Reset current class
			if (oldSize !== '') {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.Size + oldSize);
			}

			// If updateSize param is not empty, it means is either 'small' or 'medium', so we can add the class based on the updateSize param
			if (this.configs.Size !== '') {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.Size + this.configs.Size);
			}
		}

		/**
		 * Method to set a rating value
		 *
		 * @private
		 * @param {boolean} [triggerEvent=false]
		 * @return {*}  {void}
		 * @memberof Rating
		 */
		private _setValue(triggerEvent = false): void {
			// Check if passed value is decimal
			this._decimalValue = this._getDecimalValue(this.configs.RatingValue);
			// Check if passed value is half
			this._isHalfValue = this._getIsHalfValue(this.configs.RatingValue);
			// Get all inputs on rating, to properly add the :checked attribute on the correct one
			const ratingItems = this.selfElement.querySelectorAll(GlobalEnum.HTMLElement.Input);

			// Reset the is-half class
			if (Helper.Dom.Styles.ContainsClass(this.selfElement, Enum.CssClass.IsHalf)) {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.IsHalf);
			}

			// If there's only one rating item, then there's no need for further checks, this one will be checked
			if (this.configs.RatingScale === 1) {
				ratingItems[1].checked = true;
				ratingItems[1].ariaChecked = Constants.A11YAttributes.States.True;
				// Set the attr that will be used to define the default tabindex element
				Helper.Dom.Attribute.Set(ratingItems[1], Constants.FocusableTabIndexDefault, Constants.EmptyString);
				return;
			}

			// Set the newValue const to the correct value
			// If is-half or the decimal value is bigger than 0.7, that means that we will have to apply the :checked attribute on the next input
			// Otherwise, the input :checked will correspond to the one clicked.
			let newValue =
				this._isHalfValue || this._decimalValue > 0.7
					? Math.floor(this.configs.RatingValue) + 1
					: Math.floor(this.configs.RatingValue);

			if (newValue < Enum.Properties.MinRatingScale) {
				// If negative value, set it as 0 by default
				newValue = Enum.Properties.MinRatingScale;

				console.warn(
					`The value of RatingValue property on the '${this.widgetId}' ${GlobalEnum.PatternName.Rating} can't be smaller than '${Enum.Properties.MinRatingScale}'.`
				);
			} else if (newValue > this.configs.RatingScale) {
				// If value is higher than the RatingScale, assume the maxRatingScale a value
				newValue = this.configs.RatingScale;

				console.warn(
					`The value of the RatingValue property on the '${this.widgetId}' ${GlobalEnum.PatternName.Rating} exceeds the scale boundaries. To ensure its correct behaviour, set a value smaller or equal to '${this.configs.RatingScale}'.`
				);
			}

			// Set the itemas as :checked
			ratingItems[newValue].checked = true;
			ratingItems[newValue].ariaChecked = Constants.A11YAttributes.States.True;
			// Set the attr that will be used to define the default tabindex element
			Helper.Dom.Attribute.Set(ratingItems[newValue], Constants.FocusableTabIndexDefault, Constants.EmptyString);

			// If is-half add the appropriate class, otherwise just declare the this.isHalfValue, to complete the if statement
			if (this._isHalfValue) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsHalf);
			}

			// Update the variables with the new value
			this.configs.RatingValue = this._isHalfValue ? this.configs.RatingValue : newValue;

			// Call calbackfor OnSelect event
			if (triggerEvent) {
				this._triggerOnSelectEvent(this.configs.RatingValue);
			}
		}

		/**
		 * Method used to manage the Rating inputs events, they will be only set when IsEdit=False
		 * - This is needed in order to grant keyboard behaves like ckick, in order to avoid user be able
		 * to select any star by using keyboard navigation when IsEdit=False!
		 *
		 * @private
		 * @param {boolean} add Flag to indicates if events should be added or removed.
		 * @memberof Rating
		 */
		private _toggleRatingInputsEvents(add: boolean): void {
			// Get the list of inputs
			const inputsList = this.selfElement.querySelectorAll(Constants.Dot + Enum.CssClass.RatingInput);

			for (const input of inputsList) {
				if (add) {
					input.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnRatingInputKeyup);
				} else {
					input.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnRatingInputKeyup);
				}
			}
		}

		/**
		 * Method that triggers the OnSelect event
		 *
		 * @private
		 * @param {number} value
		 * @memberof Rating
		 */
		private _triggerOnSelectEvent(value: number): void {
			if (this._platformEventOnSelect !== undefined) {
				this.triggerPlatformEventCallback(this._platformEventOnSelect, value);
			}
		}

		/**
		 * Method to remove the event listeners
		 *
		 * @private
		 * @memberof Rating
		 */
		private _unsetEvents(): void {
			if ((this.selfElement && this.configs.IsEdit === false) || this._disabled) {
				this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnRatingClick);
			}

			// Manage RatingInput elements events accordingly
			this._toggleRatingInputsEvents(!this.configs.IsEdit && !this._disabled);
		}

		/**
		 * Method to retunr the list of rating placeholders with the updated id attribute
		 *
		 * @private
		 * @param {number} ratingIndex
		 * @return {*}  {string}
		 * @memberof Rating
		 */
		private _updateClonePlaceholdersAttrs(ratingIndex: number): string {
			// Store the ourterHTML of the placeholders
			let placeholdersOuterHTML = '';

			// Iterate over the cloned placeholders to redefine the id attribute
			for (const placholder of this._clonedPlaceholders) {
				// Get a clone of the placeholder to avoid changing the original (HTML Element)
				const clonedPlaceholder = placholder.cloneNode(true) as HTMLElement;
				// Update the id attribute to contains the related rating index
				clonedPlaceholder.id = `${clonedPlaceholder.id}-rating-${ratingIndex}`;
				// Append the outerHTML to the placeholdersOuterHTML
				placeholdersOuterHTML += clonedPlaceholder.outerHTML;
			}

			// Return the updated placeholders
			return placeholdersOuterHTML;
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Rating.Rating
		 */
		protected setA11YProperties(): void {
			console.warn(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to set the events
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Rating.Rating
		 */
		protected setCallbacks(): void {
			this._eventOnRatingClick = this._ratingOnClick.bind(this);
			this._eventOnRatingInputKeyup = this._ratingInputOnKeyup.bind(this);
		}

		/**
		 * Method to set the html references that will be used to manage the cssClasses and atribute properties
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Rating.Rating
		 */
		protected setHtmlElements(): void {
			this._ratingIconStatesElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.IconStates);
			this._ratingFieldsetElem = Helper.Dom.TagSelector(this.selfElement, GlobalEnum.HTMLElement.FieldSet);
		}

		/**
		 * Method to remove all assigned callbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Rating.Rating
		 */
		protected unsetCallbacks(): void {
			this._eventOnRatingClick = undefined;
			this._eventOnRatingInputKeyup = undefined;
		}

		/**
		 * Method to unset the HTML elements
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Rating.Rating
		 */
		protected unsetHtmlElements(): void {
			// Remove html from the fieldset
			this._ratingFieldsetElem.innerHTML = '';

			this._ratingIconStatesElem = undefined;
			this._ratingFieldsetElem = undefined;
		}

		/**
		 * Method to build the Rating
		 *
		 * @memberof OSFramework.Patterns.Rating.Rating
		 */
		public build(): void {
			super.build();

			this._setInitialPropertiesValues();

			this.setCallbacks();

			this.setHtmlElements();

			this._setInitialCssClasses();

			this._handlePlaceholders();

			this._createItems();

			this._setEvents();

			this._setValue();

			this.finishBuild();
		}

		/**
		 * Method to update value when a parameters changed occurs
		 *
		 * @param {string} propertyName
		 * @param {*} propertyValue
		 * @memberof OSFramework.Patterns.Rating.Rating
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			//Storing the current Size, before possibly changing this property.
			//This will enable us to remove the previous added classes to the element.
			const oldSize = this.configs.Size;

			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.RatingValue:
						this._setValue();
						break;

					case Enum.Properties.RatingScale:
						this._setScale();
						break;

					case Enum.Properties.IsEdit:
						this._setIsEdit();
						break;

					case Enum.Properties.Size:
						this._setSize(oldSize);
						break;
				}
			}
		}

		/**
		 * Method to set the Rating as disabled
		 *
		 * @memberof Rating
		 */
		public disable(): void {
			this._setIsDisabled(true);
		}

		/**
		 * Method to destroy the Rating pattern
		 *
		 * @memberof OSFramework.Patterns.Rating.Rating
		 */
		public dispose(): void {
			this._unsetEvents();

			this.unsetCallbacks();
			this.unsetHtmlElements();

			super.dispose();
		}

		/**
		 * Method to set the Rating as enabled
		 *
		 * @memberof Rating
		 */
		public enable(): void {
			this._setIsDisabled(false);
		}

		/**
		 * Method to register a given callback event handler.
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.OSGeneric} callback
		 * @memberof OSFramework.Patterns.Rating.Rating
		 */
		public registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case Enum.Events.OnSelected:
					if (this._platformEventOnSelect === undefined) {
						this._platformEventOnSelect = callback;
					}
					break;
				default:
					super.registerCallback(eventName, callback);
			}
		}
	}
}
