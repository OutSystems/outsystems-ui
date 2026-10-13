// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Feature {
	/**
	 * Abstract class to be extended by all Features
	 *
	 * @abstract
	 */
	export abstract class AbstractFeature<PT, O> implements IFeature {
		// Store the feature DOM elem
		private _featureElem: HTMLElement;
		// Store the faeture Options
		private _featureOptions: O;
		// Store the feature Pattern
		private _featurePattern: PT;

		/**
		 * Creates an instance of AbstractFeature.
		 * @param featurePattern The pattern reference that uses this feature
		 * @param featureElem The feature DOM element that will be targeted
		 * @param options The options passed to this feature, by the featurePattern
		 */
		constructor(featurePattern: PT, featureElem: HTMLElement, options: O) {
			this._featureOptions = options;
			this._featureElem = featureElem;
			this._featurePattern = featurePattern;
		}

		public dispose(): void {
			this._featureOptions = undefined;
			this._featureElem = undefined;
		}

		/**
		 * Getter for the feature Elemement
		 *
		 * @readonly
		 */
		public get featureElem(): HTMLElement {
			return this._featureElem;
		}

		/**
		 * Getter for the feature options
		 *
		 * @readonly
		 */
		public get featureOptions(): O {
			return this._featureOptions;
		}

		/**
		 * Getter for the the feature pattern element
		 *
		 * @readonly
		 */
		public get featurePattern(): PT {
			return this._featurePattern;
		}
	}
}
