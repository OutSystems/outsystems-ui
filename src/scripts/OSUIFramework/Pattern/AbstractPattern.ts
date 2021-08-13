// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns {
	/**
	 * Defines the Default props and methods for OutSystemsUI Patterns
	 */
	export abstract class AbstractPattern<C> implements Interface.IPattern {
		private _isBuilt: boolean;
		private _uniqueId: string;
		protected _configs: C;
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

		public build(): void {
			const obj = document.getElementsByName(this._uniqueId);
			if (obj.length) {
				this._selfElem = document.getElementsByName(this._uniqueId)[0];
			} else {
				throw new Error(`Object with name '${this._uniqueId}' not found.`);
			}
		}

		public equalsToID(widgetId: string): boolean {
			return widgetId === this._uniqueId || widgetId === this._widgetId;
		}

		public finishBuild(): void {
			// Set the widget id value
			this._widgetId = Helper.GetElementByUniqueId(this._uniqueId).closest(Constants.dataBlockTag).id;

			this._isBuilt = true;
		}

		public UpdateExtendedClass(activeCssClass: string, newCssClass: string): void {
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

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		public abstract changeProperty(propertyName: string, propertyValue: any): void;
	}
}
