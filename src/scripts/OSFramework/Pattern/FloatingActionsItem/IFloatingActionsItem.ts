// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.FloatingActionsItem {
	/**
	 * Defines the interface for OutSystemsUI Floating Actions Pattern
	 */
	export interface IFloatingActionsItem extends Interface.IPattern {
		setAnimationDelay(value: number): void;
		setTabindex(value: string): void;
	}
}
