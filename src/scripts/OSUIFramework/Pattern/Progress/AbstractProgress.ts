// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress {
	export abstract class AbstractProgress<C> extends AbstractPattern<C> implements IProgress {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);

			console.log(`AbstractProgress Constructor - '${uniqueId}'`);
		}

		// set default Accessibility properties
		public setAccessibilityProps(): void {
			Helper.Attribute.Set(this._selfElem, 'tabindex', '0');
			Helper.Attribute.Set(this._selfElem, 'role', 'progressbar');
			Helper.Attribute.Set(this._selfElem, 'aria-valuemin', '0');
			Helper.Attribute.Set(this._selfElem, 'aria-valuemax', '100');
		}

		// update value now Accessibility property
		public updateValueNow(progressValue: string): void {
			Helper.Attribute.Set(this._selfElem, 'aria-valuenow', progressValue);
		}
	}
}
