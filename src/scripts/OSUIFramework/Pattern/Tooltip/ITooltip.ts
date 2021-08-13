// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tooltip {
	/**
	 * Defines the interface for OutSystemsUI Tooltip Pattern
	 */
	export interface ITooltip extends Interface.IPattern {
		close(): void;
		open(): void;
	}
}
