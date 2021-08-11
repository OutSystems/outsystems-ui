// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.osuiAPI.Patterns {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export interface IPattern extends IBuilder, ISearchById {
		isBuilt: boolean;
		uniqueId: string;
		widgetId: string;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		changeProperty(propertyName: string, propertyValue: any): void;

		// eslint-disable-next-line @typescript-eslint/member-ordering
		UpdateExtendedClass(elem: HTMLElement, activeCssClass: string, newCssClass: string): void;
	}
}
