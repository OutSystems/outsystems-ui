// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.BottomSheet {
	/**
	 * Defines the interface for OutSystemsUI BottomSheet Pattern
	 *
	 * @export
	 * @interface IBottomSheet
	 * @extends {Interface.IPattern}
	 */
	export interface IBottomSheet extends Interface.IPattern {
		close(): void;
		open(): void;
	}
}
