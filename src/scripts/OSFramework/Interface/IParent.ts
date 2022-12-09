// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Interface {
	/**
	 * Defines the interface for a Pattern that will have other patterns as its childs
	 *
	 * @export
	 * @interface IParent
	 * @template CT (as ChildType)
	 */
	export interface IParent extends IPattern {
		/**
		 * Method used to be notified by a given dropdownOptionId about a given action and act accordingly
		 *
		 * @param childItem Child Item to be stored
		 * @param notifiedTo triggered notification type name
		 * @memberof OSFramework.Interface.IParent
		 */
		beNotifiedByChild(childItem: unknown, notifiedTo: string): void;
	}
}
