// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Interface/ISearchById.ts
namespace OSFramework.Interface {
========
namespace OSFramework.OSUI.Interface {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Interface/ISearchById.ts
	/**
	 * Defines the interface for objects with multiple DOM identifiers
	 *
	 * @export
	 * @interface ISearchById
	 */
	export interface ISearchById {
		/**
		 * Validates if object matched with the given id
		 *
		 * @param {string} id
		 * @return {*}  {boolean}
		 * @memberof OSFramework.Interface.ISearchById
		 */
		equalsToID(id: string): boolean;
	}
}
