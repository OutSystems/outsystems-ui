// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.FlipContent {
	/**
	 * Defines the interface for OutSystemsUI flipContent Pattern
	 */
	export interface IFlipContent extends Interface.IPattern {
		/**
		 * Method to show the back content
		 *
		 * @memberof IFlipContent
		 */
		showBackContent(): void;

		/**
		 * Method to show the front content
		 *
		 * @memberof IFlipContent
		 */
		showFrontContent(): void;

		/**
		 * Method to trigger the flipping of the pattern
		 *
		 * @memberof IFlipContent
		 */
		toggleFlipContent(): void;
	}
}
