// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace osui {
	export function GetVersion(): string {
		console.warn('osui.GetVersion(), is deprecated. Please use the API `OutSystems.OSUI.GetVersion()`.');
		return OutSystems.OSUI.GetVersion();
	}

	export function ToggleClass(el: HTMLElement, state: unknown, className: string): void {
		console.warn(
			'osui.ToggleClass(...), is deprecated. Please use the API `OutSystems.OSUI.Utils.ToggleClass(...)`.'
		);
		OutSystems.OSUI.Utils.ToggleClass(el, state, className);
	}

	export function GetClosest(elem: HTMLElement, selector: string): unknown {
		console.warn(
			'osui.GetClosest(...), is deprecated. Please use the API `OutSystems.OSUI.Utils.GetClosest(...)`.'
		);
		return OutSystems.OSUI.Utils.GetClosest(elem, selector);
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function StartMWO(): void {
		//TO BE REMOVED
		OutSystems.OSUI.Utils.StartMadeWithOS();
	}

	export function FixInputs(): void {
		console.warn('osui.FixInputs(...), is deprecated. Please use the API `OutSystems.OSUI.Utils.FixInputs(...)`.');
		OutSystems.OSUI.Utils.FixInputs();
	}

	export function HasMasterDetail(): boolean {
		console.warn(
			'osui.HasMasterDetail(), is deprecated. Please use the API `OutSystems.OSUI.Utils.HasMasterDetail()`.'
		);
		return OutSystems.OSUI.Utils.HasMasterDetail();
	}

	export function HideOnScroll(): unknown {
		console.warn(
			'osui.HideOnScroll(), is deprecated. Please use the API `OutSystems.OSUI.Utils.HideOnScroll.Init()`.'
		);
		return {
			init: () => {
				OutSystems.OSUI.Utils.HideOnScroll.Init();
			},
		};
	}
}
