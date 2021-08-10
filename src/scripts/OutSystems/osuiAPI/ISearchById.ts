// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.osuiAPI.Patterns {
	/**
	 * Defines the interface for objects with multiple DOM identifiers
	 */
	export interface ISearchById {
		/**
		 * Validates if object matched with the given id
		 */
		equalsToID(id: string): boolean;
	}
}
