// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Video.Callbacks {
	export type OSOnStateChangedEvent = {
		(videoId: string, stateChanged: string): void;
	};
}
