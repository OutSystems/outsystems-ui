// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.GestureEvent {
	// DragEvent callback types
	export type onGestureStart = { (x: number, y: number): void };
	export type onGestureMove = { (x: number, y: number, offsetX: number, offsetY: number, evt: TouchEvent): void };
	export type onGestureEnd = { (offsetX: number, offsetY: number, timeTaken: number): void };

	// SwipeEvent callback types
	export type onSwipeDown = { (): void };
	export type onSwipeLeft = { (): void };
	export type onSwipeRight = { (): void };
	export type onSwipeUp = { (): void };
}
