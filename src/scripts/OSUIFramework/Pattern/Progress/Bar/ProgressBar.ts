/// <reference path="../AbstractProgress.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress.Bar {
	export class Bar extends Progress.AbstractProgress<ProgressBarConfig> {
		// Store the events
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventAnimateEntranceEnd: any;

		// Store the htmlElements
		private _contentElem: HTMLElement;
		private _progressElem: HTMLElement;
		private _trailElem: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new ProgressBarConfig(configs));

			this._eventAnimateEntranceEnd = this._animateEntranceEnd.bind(this);
		}

		// remove the added transitionEnd event and the cssClass added at the beginning
		private _animateEntranceEnd(): void {
			this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._animateEntranceEnd);

			Helper.Style.RemoveClass(this._progressElem, ProgressEnum.CssClass.AddInitialAnimation);
		}

		// Set the default inline css variables
		private _setCssVariables(): void {
			this.changeProperty(ProgressEnum.Properties.Thickness, this._configs.Thickness);
			this.changeProperty(ProgressEnum.Properties.ProgressColor, this._configs.ProgressColor);
			this.changeProperty(ProgressEnum.Properties.Shape, this._configs.Shape);
			this.changeProperty(ProgressEnum.Properties.TrailColor, this._configs.TrailColor);
		}

		// Update info based on htmlContent
		private _setHtmlElements(): void {
			// Set the html references that will be used to manage the cssClasses and atribute properties
			this._progressElem = this._selfElem.querySelector(Constants.Dot + ProgressEnum.CssClass.Container);
			this._contentElem = this._selfElem.querySelector(Constants.Dot + ProgressEnum.CssClass.Content);
			this._trailElem = this._selfElem.querySelector(Constants.Dot + ProgressEnum.CssClass.Trail);
		}

		// Update the valuenow accessibility property
		private _updateProgressValue(): void {
			this.updateValueNow(this._configs.Progress.toString());
		}

		// Add the initial animation to the pattern if it's applicable
		protected addInitialAnimation(): void {
			// Check if the animation at init should be added
			if (this._configs.AnimateInitialProgress) {
				Helper.Style.AddClass(this._progressElem, ProgressEnum.CssClass.AddInitialAnimation);

				this._selfElem.addEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._animateEntranceEnd);
			}

			this._updateProgressValue();
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setCssVariables();

			this.addInitialAnimation();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		public changeProperty(propertyName: string, propertyValue: any): void {
			switch (propertyName) {
				case ProgressEnum.Properties.Thickness:
					this._configs.Thickness = propertyValue;

					Helper.Style.SetStyleAttribute(
						this._selfElem,
						ProgressEnum.InlineStyleProp.Thickness,
						propertyValue + Constants.Pixel
					);

					break;

				case ProgressEnum.Properties.Progress:
					this._configs.Progress = propertyValue;

					this._updateProgressValue();

					break;

				case ProgressEnum.Properties.ProgressColor:
					this._configs.ProgressColor = propertyValue;

					Helper.Style.SetStyleAttribute(
						this._selfElem,
						ProgressEnum.InlineStyleProp.ProgressColor,
						Helper.Style.GetColorValueFromColorType(this._configs.ProgressColor)
					);

					break;

				case ProgressEnum.Properties.Shape:
					this._configs.Shape = propertyValue;

					Helper.Style.SetStyleAttribute(
						this._selfElem,
						ProgressEnum.InlineStyleProp.Shape,
						Helper.Style.GetBorderRadiusValueFromShapeType(this._configs.Shape)
					);

					break;

				case ProgressEnum.Properties.TrailColor:
					this._configs.TrailColor = propertyValue;

					Helper.Style.SetStyleAttribute(
						this._selfElem,
						ProgressEnum.InlineStyleProp.TrailColor,
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
