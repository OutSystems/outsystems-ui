// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Search {
	/**
	 * Defines the interface for OutSystemsUI Search Pattern
	 */
	export interface ISearch extends Interface.IPattern {
		close(): void;
		open(): void;
		registerCallback(callback: Callbacks.OSSearchCollapseEvent): void;
	}
}
