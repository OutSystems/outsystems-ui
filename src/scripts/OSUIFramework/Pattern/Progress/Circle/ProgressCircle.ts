/// <reference path="../AbstractProgress.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress.Circle {
	export class Circle extends Progress.AbstractProgress<ProgressCircleConfig> {
		// Circunference circle value
		private _circleCircumference: number;
		private _circletSize = 0;

		// Store the events
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventAnimateEntranceEnd: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventResizeOberver: any;

		// ProgressContainer htmlElement
		private _progressConatainerElem: HTMLElement;
		// ProgressSVG htmlElement
		private _progressSvgElem: HTMLElement;

		// ResizeOberver
		private _resizeOberver: ResizeObserver;

		// Store values to be assigned to the circle
		private _strokeDasharray: number;
		private _strokeDashoffset: number;

		// TrailSVG htmlElement
		private _trailSvgElem: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new ProgressCircleConfig(configs));

			this._eventAnimateEntranceEnd = this._animateEntranceEnd.bind(this);
			this._eventResizeOberver = this._updateCircleProps.bind(this);
		}

		// Set the resizeObserver
		private _addResizeOberser(): void {
			this._resizeOberver = new ResizeObserver(this._eventResizeOberver);
			this._resizeOberver.observe(this._selfElem);
		}

		// remove the added transitionEnd event and the cssClass added at the beginning
		private _animateEntranceEnd(): void {
			this._progressSvgElem.removeEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._animateEntranceEnd);

			Helper.Style.RemoveClass(this._progressSvgElem, ProgressEnum.CssClass.AddInitialAnimation);
			Helper.Style.RemoveClass(this._progressSvgElem, ProgressEnum.CssClass.AnimateProgressChange);

			// Check if the resizeOberver already exist
			if (!this._resizeOberver) {
				// Element has fully loaded, add the resizeObserver
				this._addResizeOberser();
			}
		}

		// Convert progress value into offset to assign to our circle
		private _progressToOffset(): void {
			const _elementSize =
				this._selfElem.parentElement.clientHeight < this._selfElem.parentElement.clientWidth
					? this._selfElem.parentElement.clientHeight
					: this._selfElem.parentElement.clientWidth;

			if (this._selfElem.clientHeight < this._selfElem.parentElement.clientWidth) {
				this._circletSize = this._selfElem.parentElement.clientWidth;
			} else {
				this._circletSize = _elementSize;
			}

			Helper.Style.SetStyleAttribute(this._selfElem, Enum.InlineStyleProp.CircleSize, this._circletSize + 'px');

			const _radius = Math.floor(this._circletSize / 2 - this._configs.Thickness / 2);
			this._circleCircumference = _radius * 2 * Math.PI;

			// set the base values
			this._strokeDashoffset = this._strokeDasharray = this._circleCircumference;

			// Set the css variables that will be used at ProgressCircle
			Helper.Style.SetStyleAttribute(this._selfElem, Enum.InlineStyleProp.StrokeDasharray, this._strokeDasharray);
			Helper.Style.SetStyleAttribute(
				this._selfElem,
				Enum.InlineStyleProp.StrokeDashoffset,
				this._strokeDashoffset
			);

			// Set the radius SVG value in order to force the svg repainting
			Helper.Style.SetStyleAttribute(this._progressSvgElem, 'r', _radius);
			Helper.Style.SetStyleAttribute(this._trailSvgElem, 'r', _radius);

			// Ensure that this will run only at the Initialization
			if (!this.isBuilt) {
				// Make async to ensure that all css variables are assigned
				setTimeout(() => {
					// Update according initial style
					this.addInitialAnimation();
				}, 0);
			}
		}

		// Set the default inline css variables
		private _setCssVariables(): void {
			Helper.Style.SetStyleAttribute(
				this._selfElem,
				Enum.InlineStyleProp.Thickness,
				this._configs.Thickness + 'px'
			);

			Helper.Style.SetStyleAttribute(
				this._selfElem,
				Enum.InlineStyleProp.ProgressColor,
				Helper.Style.GetColorValueFromColorType(this._configs.ProgressColor)
			);

			Helper.Style.SetStyleAttribute(
				this._selfElem,
				Enum.InlineStyleProp.Shape,
				this._configs.Shape === GlobalEnum.ShapeTypes.Sharp
					? ProgressEnum.ShapeTypes.Sharp
					: ProgressEnum.ShapeTypes.Rounded
			);

			Helper.Style.SetStyleAttribute(
				this._selfElem,
				Enum.InlineStyleProp.TrailColor,
				Helper.Style.GetColorValueFromColorType(this._configs.TrailColor)
			);
		}

		// Update info based on htmlContent
		private _setHtmlElements(): void {
			// Set the html reference that will be used to do all the needed calcs
			this._progressConatainerElem = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.Container);
			this._progressSvgElem = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.Progress);
			this._trailSvgElem = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.Trail);
		}

		// Trigger all the meethods responsible to proper update the Circle
		private _updateCircleProps(): void {
			this._progressToOffset();
			this._updateProgressValue();
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

				// Set the progressValue into the element
				this._updateProgressValue();
			} else {
				// Since the initial animation was not added add the ResizeObserver
				this._addResizeOberser();
			}
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setCssVariables();

			this._progressToOffset();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		public changeProperty(propertyName: string, propertyValue: any): void {
			switch (propertyName) {
				case Enum.Properties.Thickness:
					this._configs.Thickness = propertyValue;

					this._updateCircleProps();

					Helper.Style.SetStyleAttribute(
						this._selfElem,
						Enum.InlineStyleProp.Thickness,
						propertyValue + 'px'
					);

					break;

				case Enum.Properties.Progress:
					this._configs.Progress = propertyValue;

					// Do the transition animation
					Helper.Style.AddClass(this._progressSvgElem, ProgressEnum.CssClass.AnimateProgressChange);

					// Add the event that will remove the responsible cssClass that added animation
					this._progressSvgElem.addEventListener(
						GlobalEnum.HTMLEvent.TransitionEnd,
						this._eventAnimateEntranceEnd
					);

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
							? ProgressEnum.ShapeTypes.Sharp
							: ProgressEnum.ShapeTypes.Rounded
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

			// Check if the resizeOberver already exist
			if (!this._resizeOberver) {
				this._resizeOberver.disconnect();
			}
		}
	}
}
