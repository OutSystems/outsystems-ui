// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns {
	/**
	 * Defines the Default props and methods for OutSystemsUI Patterns
	 */
	export abstract class AbstractPattern<C> implements Interface.IPattern {
		private _isBuilt: boolean;
		private _uniqueId: string;
		protected _configs: C;
		protected _enableAccessibility: boolean;
		protected _selfElem: HTMLElement;
		protected _widgetId: string;

		constructor(uniqueId: string, configs: C) {
			this._uniqueId = uniqueId;
			this._configs = configs;

			// console.log(`AbstractPattern Constructor - '${uniqueId}'`);
		}

		public get isBuilt(): boolean {
			return this._isBuilt;
		}

		public get configs(): C {
			return this._configs;
		}

		public get uniqueId(): string {
			return this._uniqueId;
		}

		public get widgetId(): string {
			return this._widgetId;
		}

		protected finishBuild(): void {
			//In the future we can trigger an initialized event.
			this._isBuilt = true;
		}

		protected updateExtendedClass(activeCssClass: string, newCssClass: string): void {
			if (activeCssClass !== '') {
				const activeCssClassArray = activeCssClass.split(' ');

				for (let i = 0; i < activeCssClassArray.length; ++i) {
					this._selfElem.classList.remove(activeCssClassArray[i]);
				}
			}

			if (newCssClass !== '') {
				const newCssClassArray = newCssClass.split(' ');

				for (let i = 0; i < newCssClassArray.length; ++i) {
					this._selfElem.classList.add(newCssClassArray[i]);
				}
			}
		}

		public build(): void {
			this._selfElem = Helper.GetElementByUniqueId(this._uniqueId);
			this._widgetId = this._selfElem.closest(GlobalEnum.DataBlocksTag.DataBlock).id;
			this._enableAccessibility = !!document.querySelector(Constants.Dot + Constants.HasAccessibilityClass);
		}

		public dispose(): void {
			this._isBuilt = false;
		}

		public equalsToID(patternId: string): boolean {
			return patternId === this._uniqueId || patternId === this._widgetId;
		}

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		public abstract changeProperty(propertyName: string, propertyValue: any): void;
	}
}
