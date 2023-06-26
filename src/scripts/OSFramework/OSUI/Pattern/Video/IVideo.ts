// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Video {
	/**
	 * Defines the interface for OutSystemsUI Video Pattern
	 *
	 * @export
	 * @interface IVideo
	 * @extends {Interface.IPattern}
	 */
	export interface IVideo extends Interface.IPattern {
		getVideoState(): void;
		setVideoPause(): void;
		setVideoPlay(): void;
	}
}
