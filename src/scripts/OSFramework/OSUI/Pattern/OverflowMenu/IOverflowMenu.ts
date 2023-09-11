// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.OverflowMenu {
	/**
	 * Defines the interface for OutSystemsUI OverflowMenu Pattern
	 */
	export interface IOverflowMenu extends Interface.IPattern, Interface.IOpenable {
		disable(): void;
		enable(): void;
	}
}
