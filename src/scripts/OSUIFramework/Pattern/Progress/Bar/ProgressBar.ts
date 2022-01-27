/// <reference path="../AbstractProgress.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress.Bar {
	export class Bar extends Progress.AbstractProgress<ProgressBarConfig> {
		// Store the events
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventAnimateEntranceEnd: any;

		// Store the htmlElements
		private _progressElem: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new ProgressBarConfig(configs));

			this._eventAnimateEntranceEnd = this._animateEntranceEnd.bind(this);
		}

		// remove the added transitionEnd event and the cssClass added at the beginning
		private _animateEntranceEnd(): void {
			this._progressElem.removeEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._eventAnimateEntranceEnd);

			Helper.Dom.Styles.RemoveClass(this._progressElem, ProgressEnum.CssClass.AddInitialAnimation);
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
				Helper.Dom.Styles.GetBorderRadiusValueFromShapeType(this._configs.Shape)
			);

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				ProgressEnum.InlineStyleProp.TrailColor,
				Helper.Dom.Styles.GetColorValueFromColorType(this._configs.TrailColor)
			);
		}

		// Update info based on htmlContent
		private _setHtmlElements(): void {
			// Set the html references that will be used to manage the cssClasses and atribute properties
			this._progressElem = this._selfElem.querySelector(Constants.Dot + ProgressEnum.CssClass.Container);
		}

		// Update the valuenow accessibility property
		private _updateProgressValue(): void {
			this.updateValueNow(this._configs.Progress.toString());
		}

		// Add the initial animation to the pattern if it's applicable
		protected addInitialAnimation(): void {
			// Check if the animation at init should be added
			if (this._configs.AnimateInitialProgress) {
				Helper.Dom.Styles.AddClass(this._progressElem, ProgressEnum.CssClass.AddInitialAnimation);

				this._progressElem.addEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._eventAnimateEntranceEnd);
			}

			this._updateProgressValue();
		}

		protected setElementProgressValue(value: number): void {
			if (value > 0) {
				this._configs.Progress = value;
			} else if (value > 100) {
				this._configs.Progress = 100;
			} else {
				this._configs.Progress = 0;
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

					Helper.Dom.Styles.SetStyleAttribute(
						this._selfElem,
						ProgressEnum.InlineStyleProp.Thickness,
						propertyValue + GlobalEnum.Units.Pixel
					);

					break;

				case ProgressEnum.Properties.Progress:
					this.setElementProgressValue(propertyValue);

					break;

				case ProgressEnum.Properties.ProgressColor:
					this._configs.ProgressColor = propertyValue;

					Helper.Dom.Styles.SetStyleAttribute(
						this._selfElem,
						ProgressEnum.InlineStyleProp.ProgressColor,
						Helper.Dom.Styles.GetColorValueFromColorType(this._configs.ProgressColor)
					);

					break;

				case ProgressEnum.Properties.Shape:
					this._configs.Shape = propertyValue;

					Helper.Dom.Styles.SetStyleAttribute(
						this._selfElem,
						ProgressEnum.InlineStyleProp.Shape,
						Helper.Dom.Styles.GetBorderRadiusValueFromShapeType(this._configs.Shape)
					);

					break;

				case ProgressEnum.Properties.TrailColor:
					this._configs.TrailColor = propertyValue;

					Helper.Dom.Styles.SetStyleAttribute(
						this._selfElem,
						ProgressEnum.InlineStyleProp.TrailColor,
						Helper.Dom.Styles.GetColorValueFromColorType(this._configs.TrailColor)
					);

					break;

				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}
		}
	}
}
