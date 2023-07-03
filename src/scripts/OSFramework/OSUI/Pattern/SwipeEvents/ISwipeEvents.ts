// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/SwipeEvents/ISwipeEvents.ts
namespace OSFramework.Patterns.SwipeEvents {
========
namespace OSFramework.OSUI.Patterns.SwipeEvents {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/SwipeEvents/ISwipeEvents.ts
	/**
	 * Defines the interface for OutSystemsUI SwipeEvents Pattern
	 */
	export interface ISwipeEvents extends Interface.IPattern {
		EventGestureEnd: GlobalCallbacks.Generic;
		EventGestureMove: GlobalCallbacks.Generic;
	}
}
