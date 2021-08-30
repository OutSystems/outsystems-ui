/// <reference path="../AbstractProgress.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress.Circle {
	export class Circle extends Progress.AbstractProgress<ProgressCircleConfig> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new ProgressCircleConfig(configs));
		}

		// Update info based on htmlContent
		private _setHtmlElements(): void {
			// Set the html references that will be used to manage the cssClasses and atribute properties

			console.log('_setHtmlElements();');
			// .osui-progress-circle
			// circle .osui-progress-circle--trail
			// circle .osui-progress-circle--progress
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// Set default ExtendedClass values
			if (this._configs.ExtendedClass !== '') {
				this.updateExtendedClass(this._configs.ExtendedClass, this._configs.ExtendedClass);
			}

			// Set other CSS classes
			console.log('_setInitialCssClasses();');
		}

		// Update the valuenow accessibility property
		private _updateProgressValue(): void {
			this.updateValueNow(this._configs.Progress.toString());
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setInitialCssClasses();

			this.setAccessibilityProps();

			this._updateProgressValue();

			this.finishBuild();
		}

		public changeProperty(propertyName: string, propertyValue: any): void {
			console.log('changeProperty();', propertyName, propertyValue);
		}
	}
}
