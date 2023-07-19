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
		/**
		 * Getter the value of video state
		 *
		 * @type {string}
		 * @memberof IVideo
		 */
		getVideoState: string;

		/**
		 *  Function that will trigger the set current video time method
		 *
		 * @param {number} currentTime value in seconds
		 * @memberof IVideo
		 */
		setVideoJumpToTime(currentTime: number): void;

		/**
		 * Function that will trigger the pause video method
		 *
		 * @memberof IVideo
		 */
		setVideoPause(): void;

		/**
		 * Function that will trigger the play video method
		 *
		 * @memberof IVideo
		 */
		setVideoPlay(): void;
	}
}
