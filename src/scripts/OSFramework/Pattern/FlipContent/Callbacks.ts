// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.FlipContent.Callbacks {
	export type OSFlipEvent = {
		(flipId: string, isFlipped: boolean): void;
	};
}
