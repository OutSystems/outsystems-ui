// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Interface {
	/**
	 * Defines the interface for a Pattern that will be a child of other Pattern
	 *
	 * @export
	 * @interface IChild
	 * @template PT (as ParentType)
	 */
	export interface IChild<PT> extends IPattern {
		/**
		 * Store a reference to the Dropdpown parent Element
		 *
		 * @memberof IChild
		 */
		parentElement: HTMLElement;

		/**
		 * Store the id of of the Dropdown parent
		 *
		 * @memberof IChild
		 */
		parentId: string;

		/**
		 * Store a reference to item Dropdpwn parent Element
		 *
		 * @type {PT}
		 * @memberof IChild
		 */
		parentObject: PT;

		/**
		 * Method used to get the ParentId reference
		 *
		 * @memberof IChild
		 */
		checkForParentId(): void;

		/**
		 * Method used to notify parent about the action that was performed
		 *
		 * @param actionType Action Type name
		 * @memberof IChild
		 */
		notifyParent(actionType: GlobalEnum.ChildNotifyActionParent): void;

		/**
		 * Method used to set item as focus state
		 *
		 * @memberof IChild
		 */
		setBlur(): void;

		/**
		 * Method used to set item as blur state
		 *
		 * @memberof IChild
		 */
		setFocus(): void;

		/**
		 * Method used to set the tabindex attribute
		 *
		 * @memberof IChild
		 */
		setTabindex(): void;

		/**
		 * Method used to unset the tabindex attribute
		 *
		 * @memberof IChild
		 */
		unsetTabindex(): void;
	}
}
