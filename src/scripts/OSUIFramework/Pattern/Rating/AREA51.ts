class Rating {
	constructor(config) {
		let key;

		// Auto get properties from config object
		for (key in config) {
			if (config[key] !== undefined) {
				this[key] = config[key];
			}
		}
	}

	init = function () {
		// Disable fieldset according to IsEdit parameter
		this.setFieldsetStatus(this.isEdit);

		// Handle placeholders HTML kept on ClonedPlaceholders variable
		this.handlePlaceholders();

		// Create items according to RatingScale
		this.createItems();

		// Add click eventListener
		if (this.isEdit) {
			this.elem.addEventListener('click', (e) => {
				this.handleClickEvent(e);
			});
		}

		// Set initial value
		this.setRatingValue(this.value, true);
	};

	setFieldsetStatus = function (IsEnabled: boolean) {
		if (!IsEnabled) {
			this.fieldset.setAttribute('disabled', true);
		} else if (IsEnabled && this.fieldset.disabled === true) {
			this.fieldset.removeAttribute('disabled');
		}
	};

	handlePlaceholders = function () {
		this.clonedPlaceholders = this.iconsHTML;

		if (!this.isUpdate) {
			this.icons.remove();
		}

		return this.clonedPlaceholders;
	};

	handleClickEvent = function (e) {
		this.isHalfValue = false;

		if (e.target.classList.contains('rating-input')) {
			this.value = this.getRatingValue();
			this.setRatingValue(this.value);
		}
	};

	createItems = function () {
		let index = 0;

		for (var i = 0; i <= this.scale; i++) {
			index = i;
			this.inputId = this.id + '-rating-' + index;
			this.render(index);
		}
	};

	render = function (index: number) {
		const input =
			'<input ' +
			this.isDisabled +
			' type="radio" class="rating-input wcag-hide-text" id="' +
			this.inputId +
			'" name="' +
			this.inputName +
			'" value="' +
			index +
			'"/>';
		const label =
			'<label class="' +
			(index === 0 ? 'rating-item wcag-hide-text' : 'rating-item') +
			'" for="' +
			this.inputId +
			'"><span class="wcag-hide-text">Rating ' +
			index +
			'</span>' +
			(index !== 0 ? this.clonedPlaceholders : '') +
			'</label>';

		this.fieldset.innerHTML += input + label;
	};

	getRatingValue = function () {
		const value = parseInt(this.elem.querySelector('input:checked').value);
		return value;
	};

	getDecimalValue = function (value: number) {
		return Math.round((value - Math.floor(value)) * 100) / 100;
	};

	getIsHalfValue = function (value: number) {
		const decimalValue = this.getDecimalValue(value);
		const isHalf = decimalValue >= 0.3 && decimalValue <= 0.7 ? true : false;

		return isHalf;
	};

	setScale = function (value: number) {
		this.scale = value;
		this.destroy();
		this.createItems();
	};

	setRatingValue = function (value: number, isInit: boolean) {
		let newValue: number;
		this.value = value;
		this.decimalValue = this.getDecimalValue(value);
		this.isHalfValue = this.getIsHalfValue(value);
		const ratingItems = this.elem.querySelectorAll('input');

		if (this.elem.classList.contains('is-half')) {
			this.elem.classList.remove('is-half');
		}

		if (this.value !== null) {
			if (this.scale === 1) {
				ratingItems[1].checked = true;
				return;
			}

			newValue = this.isHalfValue || this.decimalValue > 0.7 ? parseInt(this.value + 1) : parseInt(this.value);

			try {
				ratingItems[newValue].checked = true;
			} catch (e) {
				console.warn('value exceeds the scale boundaries');
				return;
			}

			this.isHalfValue ? this.elem.classList.add('is-half') : this.isHalfValue;

			if (!isInit) {
				this.onClick(this.value);
			}
		}
	};

	destroy = function (IsUpdate: boolean) {
		if (this.elem) {
			this.elem.removeEventListener('click', this.handleClickEvent);

			if (IsUpdate) {
				this.fieldset.innerHTML = '';
			}
		}
	};
}
