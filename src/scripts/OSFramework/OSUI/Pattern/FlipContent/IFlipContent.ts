// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/FlipContent/IFlipContent.ts
namespace OSFramework.Patterns.FlipContent {
========
namespace OSFramework.OSUI.Patterns.FlipContent {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/FlipContent/IFlipContent.ts
	/**
	 * Defines the interface for OutSystemsUI flipContent Pattern
	 */
	export interface IFlipContent extends Interface.IPattern {
		showBackContent(): void;
		showFrontContent(): void;
		toggleFlipContent(): void;
	}
}
