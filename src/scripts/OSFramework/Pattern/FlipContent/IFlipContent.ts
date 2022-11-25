// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.FlipContent {
	/**
	 * Defines the interface for OutSystemsUI flipContent Pattern
	 */
	export interface IFlipContent extends Interface.IPattern, Interface.ICallback {
		showBackContent(): void;
		showFrontContent(): void;
		toggleFlipContent(): void;
	}
}
