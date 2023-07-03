// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Interface/IChild.ts
namespace OSFramework.Interface {
========
namespace OSFramework.OSUI.Interface {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Interface/IChild.ts
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
		 * @memberof OSFramework.Interface.IChild
		 */
		setBlur?(): void;

		/**
		 * Method used to set item as blur state
		 *
		 * @memberof OSFramework.Interface.IChild
		 */
		setFocus?(): void;

		/**
		 * Method used to set the tabindex attribute
		 *
		 * @memberof OSFramework.Interface.IChild
		 */
		setTabindex?(): void;

		/**
		 * Method used to unset the tabindex attribute
		 *
		 * @memberof OSFramework.Interface.IChild
		 */
		unsetTabindex?(): void;
	}
}
