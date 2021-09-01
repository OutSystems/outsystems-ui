/// <reference path="../AbstractProgress.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress.Circle {
	export class Circle extends Progress.AbstractProgress<ProgressCircleConfig> {
		// Store the circunference circle value
		private _circleCircumference: number;

		// Store the events
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventAnimateEntranceEnd: any;

		// Store the htmlElement
		private _progressSvgElem: HTMLElement;

		// Store values to be assigned to the circle
		private _strokeDasharray: number;
		private _strokeDashoffset: number;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new ProgressCircleConfig(configs));

			this._eventAnimateEntranceEnd = this._animateEntranceEnd.bind(this);
		}

		// remove the added transitionEnd event and the cssClass added at the beginning
		private _animateEntranceEnd(): void {
			this._progressSvgElem.removeEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._animateEntranceEnd);

			Helper.Style.RemoveClass(this._progressSvgElem, ProgressEnum.CssClass.AddInitialAnimation);

			Helper.Style.AddClass(this._selfElem, ProgressEnum.CssClass.IsFullLoaded);
		}

		// Convert progress value into offset to assign to our circle
		private _progressToOffset(): void {
			const radius = Math.floor(this._selfElem.clientHeight / 2 - this._configs.CircleThickness / 2);
			this._circleCircumference = radius * 2 * Math.PI;

			// set the base values
			this._strokeDashoffset = this._strokeDasharray = this._circleCircumference;

			// Set the css variables that will be used at ProgressCircle
			Helper.Style.SetStyleAttribute(this._selfElem, Enum.InlineStyleProp.StrokeDasharray, this._strokeDasharray);
			Helper.Style.SetStyleAttribute(
				this._selfElem,
				Enum.InlineStyleProp.StrokeDashoffset,
				this._strokeDashoffset
			);

			// Ensure that this will run only at the Initialization
			if (!this.isBuilt) {
				// Make async to ensure that all the css variables are assigned
				setTimeout(() => {
					// Check if the initial animation should be added
					if (this._configs.AnimateInitialProgress) {
						Helper.Style.AddClass(this._progressSvgElem, ProgressEnum.CssClass.AddInitialAnimation);
					}

					// Update according initial style
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
		}

		// Update info based on htmlContent
		private _setHtmlElements(): void {
			// Set the html reference that will be used to do all the needed calcs
			this._progressSvgElem = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.Progress);
		}

		// Update the valuenow accessibility property
		private _updateProgressValue(): void {
			// Force Progress value to be 0 when receive negative values
			if (this._configs.Progress < 0) {
				this._configs.Progress = 0;
			}

			// Force Progress value to be 100 when receive bigger than 100 values
			if (this._configs.Progress > 100) {
				this._configs.Progress = 100;
			}

			// Update inline attributes based on new Progress value
			this.updateValueNow(this._configs.Progress.toString());

			// Update the offset value
			this._strokeDashoffset =
				this._circleCircumference - (this._configs.Progress / 100) * this._circleCircumference;

			Helper.Style.SetStyleAttribute(
				this._selfElem,
				Enum.InlineStyleProp.StrokeDashoffset,
				this._strokeDashoffset
			);
		}

		// Add the initial animation to the pattern if it's applicable
		protected addInitialAnimation(): void {
			// Check if the animation at init should be added
			if (this._configs.AnimateInitialProgress) {
				// Do the initial animation
				Helper.Style.AddClass(this._progressSvgElem, ProgressEnum.CssClass.AddInitialAnimation);

				// Add the event to remove the cssClass responsible to add the initial animation
				this._progressSvgElem.addEventListener(
					GlobalEnum.HTMLEvent.TransitionEnd,
					this._eventAnimateEntranceEnd
				);
			} else {
				// Make async to ensure that svg has been place in right position based on the calcs
				setTimeout(() => {
					Helper.Style.AddClass(this._selfElem, ProgressEnum.CssClass.IsFullLoaded);
				}, 5);
			}

			// Set the progressValue into the element
			this._updateProgressValue();
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setCssVariables();

			this._progressToOffset();

			this.finishBuild();

			console.log('PS: Add resizeEvent in order to update the circle values if they changed!');
		}

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		public changeProperty(propertyName: string, propertyValue: any): void {
			switch (propertyName) {
				case Enum.Properties.CircleThickness:
					this._configs.CircleThickness = propertyValue;

					this._progressToOffset();

					this._updateProgressValue();

					Helper.Style.SetStyleAttribute(
						this._selfElem,
						Enum.InlineStyleProp.CircleThickness,
						propertyValue + 'px'
					);

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

		// Destroy the ProgressCircle
		public dispose(): void {
			super.dispose();
		}
	}
}
