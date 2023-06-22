// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Feature {
	/**
	 * Abstract class to be extended by all Features
	 *
	 * @export
	 * @abstract
	 * @class AbstractFeature
	 * @implements {IFeature}
	 * @template PT Pattern type that will use this feature
	 * @template O Feature Options type
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
		 * @param {PT} featurePattern The pattern reference that uses this feature
		 * @param {HTMLElement} featureElem The feature DOM element that will be targeted
		 * @param {O} options The options passed to this feature, by the featurePattern
		 * @memberof AbstractFeature
		 */
		constructor(featurePattern: PT, featureElem: HTMLElement, options: O) {
			this._featureOptions = options;
			this._featureElem = featureElem;
			this._featurePattern = featurePattern;
		}

		/**
		 *
		 *
		 * @memberof AbstractFeature
		 */
		public dispose(): void {
			this._featureOptions = undefined;
			this._featureElem = undefined;
		}

		/**
		 * Getter for the feature Elemement
		 *
		 * @readonly
		 * @type {HTMLElement}
		 * @memberof AbstractFeature
		 */
		public get featureElem(): HTMLElement {
			return this._featureElem;
		}

		/**
		 * Getter for the feature options
		 *
		 * @readonly
		 * @type {O}
		 * @memberof AbstractFeature
		 */
		public get featureOptions(): O {
			return this._featureOptions;
		}

		/**
		 * Getter for the the feature pattern element
		 *
		 * @readonly
		 * @type {PT}
		 * @memberof AbstractFeature
		 */
		public get featurePattern(): PT {
			return this._featurePattern;
		}
	}
}
