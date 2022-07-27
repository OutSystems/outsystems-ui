// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.GestureEvent.Callbacks {
	// DragEvent callback types
	export type gestureStart = { (x: number, y: number): void };
	export type gestureMove = { (x: number, y: number, offsetX: number, offsetY: number, evt: TouchEvent): void };
	export type gestureEnd = { (offsetX: number, offsetY: number, timeTaken: number): void };

	// SwipeEvent callback types
	export type swipeDown = { (): void };
	export type swipeLeft = { (): void };
	export type swipeRight = { (): void };
	export type swipeUp = { (): void };
}
