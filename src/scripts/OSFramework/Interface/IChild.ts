// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Interface {
	/**
	 * Defines the interface for a Pattern that will be a child of other Pattern
	 *
	 * @export
	 * @interface IChild
	 */
	export interface IChild extends IPattern {
		get isFirstChild(): boolean;
		set isFirstChild(value: boolean);
		get isLastChild(): boolean;
		set isLastChild(value: boolean);

		/**
		 * Method used to set item as focus state
		 *
		 * @memberof IChild
		 */
		setBlur?(): void;

		/**
		 * Method used to set item as blur state
		 *
		 * @memberof IChild
		 */
		setFocus?(): void;

		/**
		 * Method used to set the tabindex attribute
		 *
		 * @memberof IChild
		 */
		setTabindex?(): void;

		/**
		 * Method used to unset the tabindex attribute
		 *
		 * @memberof IChild
		 */
		unsetTabindex?(): void;
	}
}
