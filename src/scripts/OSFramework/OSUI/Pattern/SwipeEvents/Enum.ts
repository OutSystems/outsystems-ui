// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/SwipeEvents/Enum.ts
namespace OSFramework.Patterns.SwipeEvents.Enum {
========
namespace OSFramework.OSUI.Patterns.SwipeEvents.Enum {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/SwipeEvents/Enum.ts
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
