namespace OSUIFramework.Helper.Element {
	// Move element to target position
	export function Move(element: HTMLElement, target: HTMLElement): void {
		if (element && target) {
			target.appendChild(element);
		}
	}
}
