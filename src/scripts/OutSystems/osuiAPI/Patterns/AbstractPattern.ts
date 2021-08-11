// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.osuiAPI.Patterns {
	/**
	 * Defines the Default props and methods for OutSystemsUI Patterns
	 */
	export abstract class AbstractPattern<C> implements IPattern {
		private _isBuilt: boolean;
		private _uniqueId: string;
		protected _configs: C;
		protected _htmlParentElem: HTMLElement;
		protected _widgetId: string;

		constructor(uniqueId: string, configs: C) {
			this._uniqueId = uniqueId;
			this._configs = configs;

			// console.log(`AbstractPattern Constructor - '${uniqueId}'`);
		}

		protected finishBuild(): void {
			this._isBuilt = true;

			const obj = document.getElementsByName(this._uniqueId);

			if (obj.length) {
				this._htmlParentElem = document.getElementsByName(this._uniqueId)[0];
			} else {
				throw new Error(`Object with name '${this._uniqueId}' not found.`);
			}
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

		public UpdateExtendedClass(elem: HTMLElement, activeCssClass: string, newCssClass: string): void {
			if (activeCssClass !== '') {
				const activeCssClassArray = activeCssClass.split(' ');

				for (let i = 0; i < activeCssClassArray.length; ++i) {
					elem.classList.remove(activeCssClassArray[i]);
				}
			}

			if (newCssClass !== '') {
				const newCssClassArray = newCssClass.split(' ');

				for (let i = 0; i < newCssClassArray.length; ++i) {
					elem.classList.add(newCssClassArray[i]);
				}
			}
		}

		public equalsToID(widgetId: string): boolean {
			return widgetId === this._uniqueId || widgetId === this._widgetId;
		}

		public abstract build(): void;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		public abstract changeProperty(propertyName: string, propertyValue: any): void;
	}
}
