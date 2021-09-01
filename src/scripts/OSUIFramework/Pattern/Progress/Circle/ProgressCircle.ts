/// <reference path="../AbstractProgress.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress.Circle {
	export class Circle extends Progress.AbstractProgress<ProgressCircleConfig> {
		// Store the circunference circle value
		private _circleCircumference: number;

		// Store the htmlElements
		private _progressCircleContainerElem: HTMLElement;
		private _progressSvgElem: HTMLElement;

		// Store values to be assigned to the circle
		private _strokeDasharray: number;
		private _strokeDashoffset: number;

		// Store the htmlElements
		private _textContainerElem: HTMLElement;
		private _trailSvgElem: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new ProgressCircleConfig(configs));
		}

		// Convert progress value into offset to assign into our circle
		private _progressToOffset(): void {
			const radius = Math.floor(parseInt(window.getComputedStyle(this._selfElem).height) / 2);
			this._circleCircumference = radius * 2 * Math.PI;

			// set the base values
			this._strokeDashoffset = this._strokeDasharray = this._circleCircumference;

			// Set the css variables that will be used at ProgressCircle
			Helper.Style.SetStyleAttribute(this._selfElem, '--stroke-dasharray', this._strokeDasharray);
			Helper.Style.SetStyleAttribute(this._selfElem, '--stroke-dashoffset', this._strokeDashoffset);

			// Ensure that this will run only at the Initialize
			if (!this.isBuilt) {
				// Make async to ensure that all the css variables are assigned
				setTimeout(() => {
					// Check if the initial animation should be added
					if (this._configs.AnimateInitialProgress) {
						Helper.Style.AddClass(this._progressSvgElem, ProgressEnum.CssClass.AddInitialAnimation);
					}

					this.addInitialAnimation();
				}, 0);
			}
		}

		// Set the default inline css variables
		private _setCssVariables(): void {
			this.changeProperty(Enum.Properties.CircleThickness, this._configs.CircleThickness);
			this.changeProperty(Enum.Properties.ProgressColor, this._configs.ProgressColor);
			this.changeProperty(Enum.Properties.Shape, this._configs.Shape);
			this.changeProperty(Enum.Properties.TrailColor, this._configs.TrailColor);

			// Set an inline css variable that will be used to proper calculate the circle radius
			Helper.Style.SetStyleAttribute(
				this._selfElem,
				Enum.InlineStyleProp.CircleRadius,
				Math.ceil(this._configs.CircleThickness / 2) + 'px'
			);
		}

		// Update info based on htmlContent
		private _setHtmlElements(): void {
			// Set the html references that will be used to manage the cssClasses and atribute properties
			this._progressCircleContainerElem = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.Container);
			this._progressSvgElem = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.Progress);
			this._textContainerElem = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.TextContainer);
			this._trailSvgElem = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.Trail);
		}

		// Update the valuenow accessibility property
		private _updateProgressValue(): void {
			// Update inline attributes based on new Progress value
			this.updateValueNow(this._configs.Progress.toString());

			// Force Progress value to be 0 when receive negative values
			if (this._configs.Progress < 0) {
				this._configs.Progress = 0;
			}

			// Force Progress value to be 100 when receive bigger than 100 values
			if (this._configs.Progress > 100) {
				this._configs.Progress = 100;
			}

			// Update the offset value
			this._strokeDashoffset =
				this._circleCircumference - (this._configs.Progress / 100) * this._circleCircumference;

			Helper.Style.SetStyleAttribute(this._selfElem, '--stroke-dashoffset', this._strokeDashoffset);

			console.log('PS: Add a is-full-loaded class');
		}

		// Add the initial animation to the pattern if it's applicable
		protected addInitialAnimation(): void {
			this._updateProgressValue();

			console.log(
				'PS: Add the transitionEnd event and after that add the is-full-loaded css Class in order to add transition animation into the item, the animate-entrance must be removed also!'
			);
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setCssVariables();

			this._progressToOffset();

			this.finishBuild();

			console.log('PS: Missing Destroy!');
			console.log('PS: Add resizeEvent in order to update the circle values if they changed!');
		}

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		public changeProperty(propertyName: string, propertyValue: any): void {
			switch (propertyName) {
				case Enum.Properties.CircleThickness:
					this._configs.CircleThickness = propertyValue;

					Helper.Style.SetStyleAttribute(this._selfElem, Enum.InlineStyleProp.CircleThickness, propertyValue);

					break;

				case Enum.Properties.Progress:
					this._configs.Progress = propertyValue;

					this._updateProgressValue();

					break;

				case Enum.Properties.ProgressColor:
					this._configs.ProgressColor = propertyValue;

					Helper.Style.SetStyleAttribute(
						this._selfElem,
						Enum.InlineStyleProp.ProgressColor,
						Helper.Style.GetColorValueFromColorType(this._configs.ProgressColor)
					);

					break;

				case Enum.Properties.Shape:
					this._configs.Shape = propertyValue;

					Helper.Style.SetStyleAttribute(
						this._selfElem,
						Enum.InlineStyleProp.Shape,
						this._configs.Shape === GlobalEnum.ShapeTypes.Sharp
							? ProgressEnum.SvgShapeTypes.Sharp
							: ProgressEnum.SvgShapeTypes.Rounded
					);

					break;

				case Enum.Properties.TrailColor:
					this._configs.TrailColor = propertyValue;

					Helper.Style.SetStyleAttribute(
						this._selfElem,
						Enum.InlineStyleProp.TrailColor,
						Helper.Style.GetColorValueFromColorType(this._configs.TrailColor)
					);

					break;

				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}
		}
	}
}
