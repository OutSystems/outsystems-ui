// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Sidebar.NativeGestures {
	export function OnGestureStart(sidebarId: string, x: number, y: number): void {
		console.log('gesture started');
	}

	export function OnGestureMove(
		sidebarId: string,
		x: number,
		y: number,
		offsetX: number,
		offsetY: number,
		evt: TouchEvent
	): void {
		console.log('gesture moving');
	}

	export function OnGestureEnd(sidebarId: string, x: number, y: number, timeTaken: number): void {
		console.log('gesture ended');
	}
}
