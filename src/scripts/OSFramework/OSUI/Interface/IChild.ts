// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Interface {
	/**
	 * Defines the interface for a Pattern that will be a child of other Pattern
	 */
	export interface IChild extends IPattern {
		/**
		 * Method used to be notified by the parent
		 *
		 * @param notificationType Notification type
		 */
		beNotifiedByParent?(notificationType: string): void;

		get isFirstChild(): boolean;
		set isFirstChild(value: boolean);
		get isLastChild(): boolean;
		set isLastChild(value: boolean);

		/**
		 * Method used to set item as focus state
		 */
		setBlur?(): void;

		/**
		 * Method used to set item as blur state
		 */
		setFocus?(): void;

		/**
		 * Method used to set the tabindex attribute
		 */
		setTabindex?(): void;

		/**
		 * Method used to unset the tabindex attribute
		 */
		unsetTabindex?(): void;
	}
}
