// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Interface {
	/**
	 * Defines the interface for OutSystemsUI Pattern parent that will have another patterns as its children
	 *
	 * @export
	 * @interface IPatternHasPatternsAsChild
	 * @template CT (as ChildType)
	 */
	export interface IPatternHasPatternsAsChild<CT> extends IPattern {
		/**
		 * Store a collection of all DropdownServerSideItems inside this DropdownServerSide instance
		 *
		 * @type {CT}
		 * @memberof IPatternHasPatternsAsChild
		 */
		childItems: Map<string, CT>; //CT.uniqueId -> CT obj;

		/**
		 * Store all the childItems Ids to help on understanding the options positions
		 *
		 * @memberof IPatternHasPatternsAsChild
		 */
		childItemsIds: string[];

		/**
		 * Method used to be notified by a given dropdownOptionId about a given action and act accordingly
		 *
		 * @param childId Dropdown Option Item Id to be stored
		 * @param notifiedTo {GlobalEnum.ChildNotifyActionParent} triggered notification type
		 */
		beNotifiedByChild(childId: string, notifiedTo: OSUIFramework.GlobalEnum.ChildNotifyActionParent): void;
	}
}
