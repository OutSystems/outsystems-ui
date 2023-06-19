// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Video {
	/**
	 * Defines the interface for OutSystemsUI Video Pattern
	 *
	 * @export
	 * @interface IVideo
	 * @extends {Interface.IPattern}
	 * @extends {Interface.ICallback}
	 */
	export interface IVideo extends Interface.IPattern {
		registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
	}
}
