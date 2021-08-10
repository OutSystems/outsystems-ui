// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.osuiAPI.Patterns {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export interface IPattern extends IBuilder, ISearchById {
		isBuilt: boolean;
		uniqueId: string;
		widgetId: string;
	}
}
