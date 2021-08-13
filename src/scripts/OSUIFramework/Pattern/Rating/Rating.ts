// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Rating {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Rating extends AbstractPattern<RatingConfig> implements IRating {
		// Store the ballon html element
		private _tooltipBallonContentElem: HTMLElement;
		private _tooltipBallonWrapperElem: HTMLElement;
		private _tooltipBallonWrapperId: string;

		// Store the content html element
		private _tooltipContentElem: HTMLElement;

		// Store all the classes strings used by the pattern
		private _ratingCssClass = {
			IsHover: 'is-hover',
			IsVisible: 'is-opened',
			Content: 'osui-tooltip_content',
			BalloonWrapper: 'osui-tooltip_balloon-wrapper',
			BalloonContent: 'osui-tooltip_balloon',
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new RatingConfig(configs));
		}

		// Add the Accessibility Attributes values
		private _setAccessibilityProps(): void {
			Helper.Attribute.Set(this._tooltipContentElem, 'role', 'tooltip');
			Helper.Attribute.Set(this._tooltipContentElem, 'tabindex', '0');
			Helper.Attribute.Set(this._tooltipContentElem, 'aria-describedby', this._tooltipBallonWrapperId);
			Helper.Attribute.Set(this._tooltipContentElem, 'aria-labelledby', this._tooltipBallonWrapperId);
		}

		// Set the html references that will be used to manage the cssClasses and atribute properties
		private _setHtmlElements(): void {
			this._tooltipContentElem = this._selfElem.querySelector('.' + this._ratingCssClass.Content);
			this._tooltipBallonContentElem = this._selfElem.querySelector('.' + this._ratingCssClass.BalloonContent);
			this._tooltipBallonWrapperElem = this._selfElem.querySelector('.' + this._ratingCssClass.BalloonWrapper);
			this._tooltipBallonWrapperId = Helper.Attribute.Get(this._tooltipBallonWrapperElem, 'id');
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// Set default ExtendedClass values
			if (this._configs.ExtendedClass !== '') {
				this.UpdateExtendedClass(this._configs.ExtendedClass, this._configs.ExtendedClass);
			}
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setInitialCssClasses();

			this._setAccessibilityProps();

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
		public setValue(): void {}

		// Get the rating value
		public getValue(): void {}
	}
}
