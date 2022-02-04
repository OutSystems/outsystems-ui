/// <reference path="../AbstractProgress.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress.Bar {
	export class Bar extends Progress.AbstractProgress<ProgressBarConfig> {
		private _eventAnimateEntranceEnd: Callbacks.Generic;

		// Store the htmlElements
		private _progressElem: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new ProgressBarConfig(configs));
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
				this.configs.Thickness + GlobalEnum.Units.Pixel
			);

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				ProgressEnum.InlineStyleProp.ProgressColor,
				Helper.Dom.Styles.GetColorValueFromColorType(this.configs.ProgressColor)
			);

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				ProgressEnum.InlineStyleProp.Shape,
				Helper.Dom.Styles.GetBorderRadiusValueFromShapeType(this.configs.Shape)
			);

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				ProgressEnum.InlineStyleProp.TrailColor,
				Helper.Dom.Styles.GetColorValueFromColorType(this.configs.TrailColor)
			);
		}

		private _updateProgressColor(value: string): void {
			this.configs.ProgressColor = value;

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				ProgressEnum.InlineStyleProp.ProgressColor,
				Helper.Dom.Styles.GetColorValueFromColorType(this.configs.ProgressColor)
			);
		}

		// Update the valuenow accessibility property
		private _updateProgressValue(): void {
			this.updateValueNow(this.configs.Progress.toString());
		}

		private _updateShape(value: string): void {
			this.configs.Shape = value;

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				ProgressEnum.InlineStyleProp.Shape,
				Helper.Dom.Styles.GetBorderRadiusValueFromShapeType(this.configs.Shape)
			);
		}

		private _updateThickness(value: number): void {
			this.configs.Thickness = value;

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				ProgressEnum.InlineStyleProp.Thickness,
				value + GlobalEnum.Units.Pixel
			);
		}

		private _updateTrailColor(value: string): void {
			this.configs.TrailColor = value;

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				ProgressEnum.InlineStyleProp.TrailColor,
				Helper.Dom.Styles.GetColorValueFromColorType(this.configs.TrailColor)
			);
		}

		// Add the initial animation to the pattern if it's applicable
		protected addInitialAnimation(): void {
			// Check if the animation at init should be added
			if (this.configs.AnimateInitialProgress) {
				Helper.Dom.Styles.AddClass(this._progressElem, ProgressEnum.CssClass.AddInitialAnimation);

				this._progressElem.addEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._eventAnimateEntranceEnd);
			}

			this._updateProgressValue();
		}

		protected setCallbacks(): void {
			this._eventAnimateEntranceEnd = this._animateEntranceEnd.bind(this);
		}

		protected setElementProgressValue(value: number): void {
			if (value <= 0) {
				this.configs.Progress = 0;
			} else if (value > 100) {
				this.configs.Progress = 100;
			} else {
				this.configs.Progress = value;
			}

			this._updateProgressValue();
		}

		// Update info based on htmlContent
		protected setHtmlElements(): void {
			// Set the html references that will be used to manage the cssClasses and atribute properties
			this._progressElem = this._selfElem.querySelector(Constants.Dot + ProgressEnum.CssClass.Container);
		}

		protected unsetCallbacks(): void {
			this._eventAnimateEntranceEnd = undefined;
		}

		protected unsetHtmlElements(): void {
			this._progressElem = undefined;
		}

		public build(): void {
			super.build();

			this.setHtmlElements();

			this.setElementProgressValue(this.configs.Progress);

			this._setCssVariables();

			this.addInitialAnimation();

			this.setCallbacks();

			this.finishBuild();
		}

		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			switch (propertyName) {
				case ProgressEnum.Properties.Thickness:
					this._updateThickness(propertyValue as number);
					break;

				case ProgressEnum.Properties.Progress:
					this.setElementProgressValue(propertyValue as number);
					break;

				case ProgressEnum.Properties.ProgressColor:
					this._updateProgressColor(propertyValue as string);
					break;

				case ProgressEnum.Properties.Shape:
					this._updateShape(propertyValue as string);
					break;

				case ProgressEnum.Properties.TrailColor:
					this._updateTrailColor(propertyValue as string);
					break;
			}
		}

		public dispose(): void {
			this.unsetHtmlElements();
			this.unsetCallbacks();
			super.dispose();
		}
	}
}
