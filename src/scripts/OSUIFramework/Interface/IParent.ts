// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Interface {
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
		 * @param childId Dropdown Option Item Id to be stored
		 * @param notifiedTo {GlobalEnum.ChildNotifyActionParent} triggered notification type
		 */
		beNotifiedByChild(childId: string, notifiedTo: OSUIFramework.GlobalEnum.ChildNotifyActionParent): void;
	}
}
