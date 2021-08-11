/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace osui {
	export function GetVersion(): any {
		return OutSystems.OSUI.GetVersion();
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	export function ToggleClass(el: HTMLElement, state: any, className: string): any {
		OutSystems.OSUI.ToggleClass(el, state, className);
	}

	export function GetClosest(elem: HTMLElement, selector: string): any {
		return OutSystems.OSUI.GetClosest(elem, selector);
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function StartMWO(): any {
		OutSystems.OSUI.StartMadeWithOS();
	}

	export function FixInputs(): any {
		OutSystems.OSUI.FixInputs();
	}

	export function HasMasterDetail(): any {
		OutSystems.OSUI.HasMasterDetail();
	}

	export function HideOnScroll(): any {
		return {
			init: () => {
				OutSystems.OSUI.HideOnScroll.Init();
			},
		};
	}
}
