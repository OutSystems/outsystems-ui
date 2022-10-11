// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Interface {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 *
	 * @export
	 * @interface IPattern
	 * @extends {IBuilder}
	 * @extends {IDisposable}
	 * @extends {ISearchById}
	 */
	export interface IPattern extends IBuilder, IDisposable, ISearchById {
		/**
		 * Indicates if the instance of the pattern is built.
		 *
		 * @type {boolean}
		 * @memberof OSFramework.Interface.IPattern
		 */
		isBuilt: boolean;

		/**
		 * Pattern HTML element
		 *
		 * @type {string}
		 * @memberof OSFramework.Interface.IPattern
		 */
		selfElement: HTMLElement;

		/**
		 * Internal Id of the instance of the pattern.
		 *
		 * @type {string}
		 * @memberof OSFramework.Interface.IPattern
		 */
		uniqueId: string;

		/**
		 * External Id of the instance of the pattern
		 *
		 * @type {string}
		 * @memberof OSFramework.Interface.IPattern
		 */
		widgetId: string;

		/**
		 * Method signature to change the properties/configs of the pattern.
		 *
		 * @param {string} propertyName
		 * @param {*} propertyValue
		 * @memberof OSFramework.Interface.IPattern
		 */
		changeProperty(propertyName: string, propertyValue: unknown): void;
	}
}
