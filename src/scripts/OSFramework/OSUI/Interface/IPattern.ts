// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Interface {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export interface IPattern extends IBuilder, IDisposable, ISearchById {
		/**
		 * Indicates if the instance of the pattern is built.
		 */
		isBuilt: boolean;

		/**
		 * Pattern HTML element
		 */
		selfElement: HTMLElement;

		/**
		 * Internal Id of the instance of the pattern.
		 */
		uniqueId: string;

		/**
		 * External Id of the instance of the pattern
		 */
		widgetId: string;

		/**
		 * Method signature to change the properties/configs of the pattern.
		 *
		 * @param propertyName
		 * @param propertyValue
		 */
		changeProperty(propertyName: string, propertyValue: unknown): void;

		/**
		 * Enables to register simple callbacks for the platform. Internal use.
		 *
		 * @param eventName
		 * @param callback
		 */
		registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
	}
}
