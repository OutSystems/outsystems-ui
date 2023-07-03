// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Interface/IParent.ts
namespace OSFramework.Interface {
========
namespace OSFramework.OSUI.Interface {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Interface/IParent.ts
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
		beNotifiedByChild(childItem: IChild, notifiedTo: string): void;
	}
}
