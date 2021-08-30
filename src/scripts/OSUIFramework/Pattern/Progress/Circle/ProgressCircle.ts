/// <reference path="../AbstractProgress.ts" />
/// <reference path="../ProgressEnum.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress.Circle {
	export class Circle extends Progress.AbstractProgress<ProgressCircleConfig> {
		// Store the events
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventAnimateEntranceEnd: any;

		// Store the htmlElements
		private _progressCircleContainerElem: HTMLElement;
		private _progressSvgElem: HTMLElement;
		private _textContainerElem: HTMLElement;
		private _trailSvgElem: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new ProgressCircleConfig(configs));

			this._eventAnimateEntranceEnd = this._animateEntranceEnd.bind(this);
		}

		// remove the added transitionEnd event and the cssClass added at the beginning
		private _animateEntranceEnd(): void {
			this._progressSvgElem.removeEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._animateEntranceEnd);

			Helper.Style.RemoveClass(this._progressSvgElem, ProgressEnum.CssClass.AddInitialAnimation);
		}

		// Set the default inline css variables
		private _setCssVariables(): void {
			Helper.Style.SetStyleAttribute(
				this._selfElem,
				Enum.InlineStyleProp.CircleThickness,
				this._configs.CircleThickness
			);

			Helper.Style.SetStyleAttribute(
				this._selfElem,
				Enum.InlineStyleProp.ProgressColor,
				this._configs.ProgressColor
			);

			Helper.Style.SetStyleAttribute(this._selfElem, Enum.InlineStyleProp.TrailColor, this._configs.TrailColor);
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
			this.updateValueNow(this._configs.Progress.toString());
		}

		// Add the initial animation to the pattern if it's applicable
		protected addInitialAnimation(): void {
			// Check if the animation at init should be added
			if (this._configs.AnimateInitialProgress) {
				Helper.Style.AddClass(this._progressSvgElem, ProgressEnum.CssClass.AddInitialAnimation);

				this._progressSvgElem.addEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._animateEntranceEnd);
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

					Helper.Style.SetStyleAttribute(this._selfElem, Enum.InlineStyleProp.ProgressColor, propertyValue);

					break;

				case Enum.Properties.TrailColor:
					this._configs.TrailColor = propertyValue;

					Helper.Style.SetStyleAttribute(this._selfElem, Enum.InlineStyleProp.TrailColor, propertyValue);

					break;

				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}
		}
	}
}
