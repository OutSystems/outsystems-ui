// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns {
	/**
	 * Defines the Default props and methods for OutSystemsUI Patterns
	 *
	 * @export
	 * @abstract
	 * @class AbstractPattern
	 * @implements {Interface.IPattern}
	 * @template C
	 */
	export abstract class AbstractPattern<C extends AbstractConfiguration> implements Interface.IPattern {
		/**
		 * Indicates if the pattern has been built or not.
		 *
		 * @private
		 * @memberof AbstractPattern
		 */
		private _isBuilt = false;

		/**
		 * Id generated by us, and added to the HTML to uniquely identify a pattern.
		 *
		 * @private
		 * @type {string}
		 * @memberof AbstractPattern
		 */
		private _uniqueId: string;

		/**
		 * Pattern configurations (doubling as current state). Extends AbstractConfiguration.
		 *
		 * @protected
		 * @type {C}
		 * @memberof AbstractPattern
		 */
		protected _configs: C; //TODO: change to private

		/**
		 * Refence for the base HTML of the element of this pattern;
		 *
		 * @protected
		 * @type {HTMLElement}
		 * @memberof AbstractPattern
		 */
		protected _selfElem: HTMLElement; //TODO: change to private

		/**
		 * Id of the widget. This will be the Id that the developer will be using in runtime.
		 *
		 * @protected
		 * @type {string}
		 * @memberof AbstractPattern
		 */
		protected _widgetId: string;

		constructor(uniqueId: string, configs: C) {
			this._uniqueId = uniqueId;
			this._configs = configs;
		}

		/**
		 * Sets the HTML elements, by setting the references and the attributes.
		 *
		 * @private
		 * @memberof AbstractPattern
		 */
		private _setCommonHtmlElements(): void {
			this._selfElem = Helper.Dom.GetElementByUniqueId(this._uniqueId);
			this._widgetId = this._selfElem.closest(GlobalEnum.DataBlocksTag.DataBlock).id;

			if (this._configs.ExtendedClass !== '') {
				this._updateExtendedClass('', this._configs.ExtendedClass);
			}
		}

		/**
		 * Unsets the refences to the HTML elements.
		 *
		 * @protected
		 * @memberof AbstractPattern
		 */
		private _unsetCommonHtmlElements(): void {
			this._selfElem = undefined;
		}

		/**
		 * Method that knows how to update the Extended class of the pattern.
		 *
		 * @private
		 * @param {string} currentCssClasses
		 * @param {string} newCssClass
		 * @memberof AbstractPattern
		 */
		private _updateExtendedClass(currentCssClasses: string, newCssClass: string): void {
			const currentClassesList = currentCssClasses.split(' ');
			const newClassesList = newCssClass.split(' ');
			let classesToRemove = [];
			let classesToAdd = [];

			if (currentCssClasses !== '') {
				classesToRemove = currentClassesList.filter((currClass) => newClassesList.indexOf(currClass) === -1);
			}

			if (newCssClass !== '') {
				classesToAdd = newClassesList.filter((newClass) => currentClassesList.indexOf(newClass) === -1);
			}

			//Let's remove only the classes that are to do so.
			if (classesToRemove.length > 0) {
				classesToRemove.forEach((classToRemove) => {
					Helper.Dom.Styles.RemoveClass(this._selfElem, classToRemove);
				});
			}

			//Let's add only the new classes
			if (classesToAdd.length > 0) {
				classesToAdd.forEach((classToAdd) => {
					Helper.Dom.Styles.AddClass(this._selfElem, classToAdd);
				});
			}
		}

		/**
		 * Getter that allows to obtain the accessibility is enabled.
		 *
		 * @readonly
		 * @protected
		 * @type {boolean}
		 * @memberof AbstractPattern
		 */
		//TODO: getter to remove.
		protected get _enableAccessibility(): boolean {
			return Helper.DeviceInfo.HasAccessibilityEnabled;
		}

		/**
		 * Getter that allows to obtain the self element.
		 *
		 * @readonly
		 * @protected
		 * @type {(HTMLElement | undefined)}
		 * @memberof AbstractPattern
		 */
		protected get selfElement(): HTMLElement {
			return this._selfElem;
		}

		/**
		 * Getter that tells if the pattern is already built.
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof AbstractPattern
		 */
		public get isBuilt(): boolean {
			return this._isBuilt;
		}

		/**
		 * Current configurations/state of the pattern.
		 *
		 * @readonly
		 * @type {C}
		 * @memberof AbstractPattern
		 */
		public get configs(): C {
			return this._configs;
		}

		/**
		 * Unique id of the pattern. Internal use only.
		 *
		 * @readonly
		 * @type {string}
		 * @memberof AbstractPattern
		 */
		public get uniqueId(): string {
			return this._uniqueId;
		}

		/**
		 * Id of the pattern known by the developer. External use only.
		 *
		 * @readonly
		 * @type {string}
		 * @memberof AbstractPattern
		 */
		public get widgetId(): string {
			return this._widgetId;
		}

		/**
		 * Marks the built as being finished.
		 *
		 * @protected
		 * @memberof AbstractPattern
		 */
		protected finishBuild(): void {
			//In the future we can trigger an initialized event.
			this._isBuilt = true;
		}

		/**
		 * Builds the pattern.
		 *
		 * @memberof AbstractPattern
		 */
		public build(): void {
			this._setCommonHtmlElements();
		}

		/**
		 * Changes the value of the properties in the configurations and
		 * if changes are to a common property, applies the changes.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof AbstractPattern
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			//TODO: is this the best way to deal with properties? Or should we use - Object.getOwnPropertyDescriptor(this._configs.__proto__, propertyName)
			if (this._configs.hasOwnProperty(propertyName) /*|| this._configs[propertyName] !== undefined*/) {
				if (this._isBuilt) {
					switch (propertyName) {
						case GlobalEnum.CommonPatternsProperties.ExtendedClass:
							this._updateExtendedClass(this._configs.ExtendedClass, propertyValue as string);
							break;
					}
				}
				//First we used the previous value of the ExtendedClass config.
				//then we update it or any other config.
				if (this._configs.validateCanChange(this._isBuilt, propertyName)) {
					this._configs[propertyName] = this._configs.validateDefault(propertyName, propertyValue);
				}
			} else {
				throw new Error(`changeProperty - Property '${propertyName}' can't be changed.`);
			}
		}

		/**
		 * Disposes the pattern.
		 *
		 * @memberof AbstractPattern
		 */
		public dispose(): void {
			this._isBuilt = false;
			this._unsetCommonHtmlElements();
			this._configs = undefined;
		}

		/**
		 * Enables to uniquely identify the pattern in all ways.
		 *
		 * @param {string} patternId
		 * @return {*}  {boolean}
		 * @memberof AbstractPattern
		 */
		public equalsToID(patternId: string): boolean {
			return patternId === this._uniqueId || patternId === this._widgetId;
		}

		//TODO: add this to make all patterns implement method.
		//protected abstract setHtmlElements();
		//protected abstract unsetHtmlElements();
		//protected abstract setCallbacks();
		//protected abstract unsetCallbacks();
		//protected abstract setA11YProperties();
	}
}
