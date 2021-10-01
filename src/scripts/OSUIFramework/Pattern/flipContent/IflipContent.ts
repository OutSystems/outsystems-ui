// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.FlipContent {
	/**
	 * Defines the interface for OutSystemsUI flipContent Pattern
	 */
	export interface IFlipContent extends Interface.IPattern, Interface.ICallback, Interface.IRenderUpdate {
		triggerFlip(): void;
	}
}
