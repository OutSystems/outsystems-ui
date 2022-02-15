// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Interface {
	/**
	 * Defines the interface for OutSystemsUI Pattern that will be a child of another OutSystemsUI Pattern
	 *
	 * @export
	 * @interface IPatternIsPatternChild
	 * @template PT (as ParentType)
	 */
	export interface IPatternIsPatternChild<PT> extends IPattern {
		/**
		 * Store a reference to the Dropdpown parent Element
		 *
		 * @memberof IPatternIsPatternChild
		 */
		parentElement: HTMLElement;

		/**
		 * Store the id of of the Dropdown parent
		 *
		 * @memberof IPatternIsPatternChild
		 */
		parentId: string;

		/**
		 * Store a reference to item Dropdpwn parent Element
		 *
		 * @type {PT}
		 * @memberof IPatternIsPatternChild
		 */
		parentObject: PT;

		/**
		 * Method used to get the ParentId reference
		 *
		 * @memberof IPatternIsPatternChild
		 */
		checkForParentId(): void;

		/**
		 * Method used to notify parent about the action that was performed
		 *
		 * @param actionType Action Type name
		 * @memberof IPatternIsPatternChild
		 */
		notifyParent(actionType: GlobalEnum.ChildNotifyActionParent): void;

		/**
		 * Method used to set item as focus state
		 *
		 * @memberof IPatternIsPatternChild
		 */
		setBlur(): void;

		/**
		 * Method used to set item as blur state
		 *
		 * @memberof IPatternIsPatternChild
		 */
		setFocus(): void;

		/**
		 * Method used to set the tabindex attribute
		 *
		 * @memberof IPatternIsPatternChild
		 */
		setTabindex(): void;

		/**
		 * Method used to unset the tabindex attribute
		 *
		 * @memberof IPatternIsPatternChild
		 */
		unsetTabindex(): void;
	}
}
