// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Interface {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export interface IPattern extends IBuilder, IDisposable, ISearchById {
		isBuilt: boolean;
		uniqueId: string;
		widgetId: string;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		changeProperty(propertyName: string, propertyValue: any): void;
	}
}
