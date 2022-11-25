// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.GestureEvent.Callbacks {
	// DragEvent callback types
	export type GestureStart = { (x: number, y: number): void };
	export type GestureMove = { (x: number, y: number, offsetX: number, offsetY: number, evt: TouchEvent): void };
	export type GestureEnd = { (offsetX: number, offsetY: number, timeTaken: number): void };

	// SwipeEvent callback types
	export type SwipeDown = { (): void };
	export type SwipeLeft = { (): void };
	export type SwipeRight = { (): void };
	export type SwipeUp = { (): void };
}
