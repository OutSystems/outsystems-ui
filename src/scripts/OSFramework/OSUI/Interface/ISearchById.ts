// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Interface {
	/**
	 * Defines the interface for objects with multiple DOM identifiers
	 */
	export interface ISearchById {
		/**
		 * Validates if object matched with the given id
		 *
		 * @param id Id compared against the unique id and the widget id of the object
		 */
		equalsToID(id: string): boolean;
	}
}
