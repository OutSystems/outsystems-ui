// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Feature {
	export abstract class AbstractFeature<PT, O> implements IFeature {
		private _featureElem: HTMLElement;
		private _featureOptions: O;
		private _featurePattern: PT;
		private _isBuilt: boolean;

		constructor(featurePattern: PT, featureElem: HTMLElement, options: O) {
			this._featureOptions = options;
			this._featureElem = featureElem;
			this._featurePattern = featurePattern;
			this.build();
		}

		public build(): void {
			this._isBuilt = true;
		}

		public dispose(): void {
			this._featureOptions = undefined;
			this._featureElem = undefined;
		}

		public get featureElem(): HTMLElement {
			return this._featureElem;
		}

		public get featureOptions(): O {
			return this._featureOptions;
		}

		public get featurePattern(): PT {
			return this._featurePattern;
		}

		public get isBuilt(): boolean {
			return this._isBuilt;
		}
	}
}
