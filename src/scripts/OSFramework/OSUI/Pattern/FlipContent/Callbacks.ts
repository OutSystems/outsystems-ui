// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.FlipContent.Callbacks {
	export type OSFlipEvent = {
		(flipId: string, isFlipped: boolean): void;
	};
}
