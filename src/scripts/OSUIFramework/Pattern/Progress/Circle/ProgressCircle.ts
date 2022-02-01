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

		// ProgressSVG htmlElement
		private _progressSvgElem: HTMLElement;

		// ResizeOberver
		private _resizeObserver: ResizeObserver;

		// Store values to be assigned to the circle
		private _strokeDasharray: number;
		private _strokeDashoffset: number;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new ProgressCircleConfig(configs));

			this.setCallbacks();
		}

		// Set the resizeObserver
		private _addResizeOberser(): void {
			this._resizeObserver = new ResizeObserver((entries) => {
				// We wrap it in requestAnimationFrame to avoid this error - ResizeObserver loop limit exceeded
				requestAnimationFrame(() => {
					if (!Array.isArray(entries) || !entries.length) {
						return;
					}

					this._updateCircleProps();
				});
			});
			this._resizeObserver.observe(this._selfElem);
		}

		// remove the added transitionEnd event and the cssClass added at the beginning
		private _animateEntranceEnd(): void {
			this._progressSvgElem.removeEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._animateEntranceEnd);

			Helper.Dom.Styles.RemoveClass(this._progressSvgElem, ProgressEnum.CssClass.AddInitialAnimation);
			Helper.Dom.Styles.RemoveClass(this._progressSvgElem, ProgressEnum.CssClass.AnimateProgressChange);

			// Check if the resizeOberver does not exist yet!
			if (!this._resizeObserver) {
				// Create the Oberver
				this._addResizeOberser();
			}
		}

		// Convert progress value into offset to assign to our circle
		private _progressToOffset(): void {
			// Get the pattern parent size
			const _elementSize =
				this._selfElem.parentElement.clientHeight < this._selfElem.parentElement.clientWidth
					? this._selfElem.parentElement.clientHeight
					: this._selfElem.parentElement.clientWidth;

			// Check the maxValue that the circle must have
			if (this._selfElem.clientHeight < this._selfElem.parentElement.clientWidth) {
				this._circletSize = this._selfElem.parentElement.clientWidth;
			} else {
				this._circletSize = _elementSize;
			}

			// Set the css variable to
			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.InlineStyleProp.CircleSize,
				this._circletSize + GlobalEnum.Units.Pixel
			);

			const _radius = Math.floor(this._circletSize / 2 - this._configs.Thickness / 2);
			this._circleCircumference = _radius * 2 * Math.PI;

			// set the base values
			this._strokeDashoffset = this._strokeDasharray = this._circleCircumference;

			// Set the css variables that will be used at ProgressCircle
			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.InlineStyleProp.CircleRadius,
				_radius + GlobalEnum.Units.Pixel
			);
			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.InlineStyleProp.StrokeDasharray,
				this._strokeDasharray
			);
			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.InlineStyleProp.StrokeDashoffset,
				this._strokeDashoffset
			);

			// Ensure that this will run only at the Initialization
			if (!this.isBuilt) {
				// Make async to ensure that all css variables are assigned
				// Update according initial style
				Helper.AsyncInvocation(this.addInitialAnimation.bind(this));
			}
		}

		// Set the default inline css variables
		private _setCssVariables(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				ProgressEnum.InlineStyleProp.Thickness,
				this._configs.Thickness + GlobalEnum.Units.Pixel
			);

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				ProgressEnum.InlineStyleProp.ProgressColor,
				Helper.Dom.Styles.GetColorValueFromColorType(this._configs.ProgressColor)
			);

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				ProgressEnum.InlineStyleProp.Shape,
				this._configs.Shape === GlobalEnum.ShapeTypes.Sharp
					? ProgressEnum.ShapeTypes.Sharp
					: ProgressEnum.ShapeTypes.Round
			);

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				ProgressEnum.InlineStyleProp.TrailColor,
				Helper.Dom.Styles.GetColorValueFromColorType(this._configs.TrailColor)
			);
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

			Helper.Dom.Styles.SetStyleAttribute(
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
				Helper.Dom.Styles.AddClass(this._progressSvgElem, ProgressEnum.CssClass.AddInitialAnimation);

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

		protected setCallbacks(): void {
			this._eventAnimateEntranceEnd = this._animateEntranceEnd.bind(this);
		}

		protected setElementProgressValue(value: number): void {
			this._configs.Progress = value;

			// Do the transition animation
			Helper.Dom.Styles.AddClass(this._progressSvgElem, ProgressEnum.CssClass.AnimateProgressChange);

			// Add the event that will remove the responsible cssClass that added animation
			this._progressSvgElem.addEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._eventAnimateEntranceEnd);

			this._updateProgressValue();
		}

		// Update info based on htmlContent
		protected setHtmlElements(): void {
			// Set the html reference that will be used to do all the needed calcs
			this._progressSvgElem = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.Progress);
		}

		protected unsetCallbacks(): void {
			this._eventAnimateEntranceEnd = undefined;
		}

		protected unsetHtmlElements(): void {
			// Set the html reference that will be used to do all the needed calcs
			this._progressSvgElem = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.Progress);
		}

		protected updateProgressColor(value: string): void {
			this._configs.ProgressColor = value;

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				ProgressEnum.InlineStyleProp.ProgressColor,
				Helper.Dom.Styles.GetColorValueFromColorType(this._configs.ProgressColor)
			);
		}

		protected updateShape(value: string): void {
			this._configs.Shape = value;

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				ProgressEnum.InlineStyleProp.Shape,
				this._configs.Shape === GlobalEnum.ShapeTypes.Sharp
					? ProgressEnum.ShapeTypes.Sharp
					: ProgressEnum.ShapeTypes.Round
			);
		}

		protected updateThickness(value: number): void {
			this._configs.Thickness = value;

			this._updateCircleProps();

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				ProgressEnum.InlineStyleProp.Thickness,
				this._configs.Thickness + GlobalEnum.Units.Pixel
			);
		}

		protected updateTrailColor(value: string): void {
			this._configs.TrailColor = value;

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				ProgressEnum.InlineStyleProp.TrailColor,
				Helper.Dom.Styles.GetColorValueFromColorType(this._configs.TrailColor)
			);
		}

		public build(): void {
			super.build();

			this.setHtmlElements();

			this._setCssVariables();

			this._progressToOffset();

			this.finishBuild();
		}

		public changeProperty(propertyName: string, propertyValue: unknown): void {
			switch (propertyName) {
				case ProgressEnum.Properties.Thickness:
					this.updateThickness(propertyValue as number);
					break;

				case ProgressEnum.Properties.Progress:
					this.setProgressValue(propertyValue as number);
					break;

				case ProgressEnum.Properties.ProgressColor:
					this.updateProgressColor(propertyValue as string);
					break;

				case ProgressEnum.Properties.Shape:
					this.updateShape(propertyValue as string);

					break;

				case ProgressEnum.Properties.TrailColor:
					this.updateTrailColor(propertyValue as string);
					break;

				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}
		}

		// Destroy the ProgressCircle
		public dispose(): void {
			super.dispose();

			this.unsetHtmlElements();

			this.unsetCallbacks();

			// Check if the resizeOberver already exists
			if (this._resizeObserver) {
				this._resizeObserver.disconnect();
			}
		}
	}
}
