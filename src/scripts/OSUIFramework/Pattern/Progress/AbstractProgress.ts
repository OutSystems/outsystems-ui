// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress {
	export abstract class AbstractProgress<C extends ProgressConfiguration>
		extends AbstractPattern<C>
		implements IProgress
	{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		// Set default Accessibility properties
		private _setAccessibilityProps(): void {
			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.TabIndex, '0');

			Helper.Attribute.Set(
				this._selfElem,
				Constants.AccessibilityAttribute.Role.AttrName,
				Constants.AccessibilityAttribute.Role.Progressbar
			);

			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.Aria.ValueMin, '0');

			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.Aria.ValueMax, '100');
		}

		// Update valuenow Accessibility property and CssVariable that will be used to set the progress value into pattern
		protected updateValueNow(progressValue: string): void {
			Helper.Attribute.Set(this._selfElem, 'aria-valuenow', progressValue);

			Helper.Style.SetStyleAttribute(
				this._selfElem,
				ProgressEnum.InlineStyleProp.ProgressValue,
				progressValue + Constants.Percentage
			);
		}

		public build(): void {
			super.build();

			this._setAccessibilityProps();
		}

		// Implement the _addInitialAnimation method since a transitionend event must be added, this must be implemented at childs level
		protected abstract addInitialAnimation(): void;
	}
}
