// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.SwipeEvents.Enum {
	/**
	 * SwipeEvents Enum properties
	 */
	export enum Events {
		SwipeUp = 'SwipeUp',
		SwipeDown = 'SwipeDown',
		SwipeRight = 'SwipeRight',
		SwipeLeft = 'SwipeLeft',
	}

	export enum Properties {
		Threshold = 10,
		Velocity = 0.3,
	}
}
