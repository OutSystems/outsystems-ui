// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.SwipeEvents {
	/**
	 * Defines the interface for OutSystemsUI SwipeEvents Pattern
	 */
	export interface ISwipeEvents extends Interface.IPattern {
		EventGestureEnd: GlobalCallbacks.Generic;
		EventGestureMove: GlobalCallbacks.Generic;
	}
}
