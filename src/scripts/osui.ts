/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace osui {
	export function GetVersion(): any {
		return OutSystems.osuiAPI.GetVersion();
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	export function ToggleClass(el: HTMLElement, state: any, className: string): any {
		OutSystems.osuiAPI.ToggleClass(el, state, className);
	}

	export function GetClosest(elem: HTMLElement, selector: string): any {
		return OutSystems.osuiAPI.GetClosest(elem, selector);
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function StartMWO(): any {
		OutSystems.osuiAPI.StartMadeWithOS();
	}

	export function FixInputs(): any {
		OutSystems.osuiAPI.FixInputs();
	}

	export function HasMasterDetail(): any {
		OutSystems.osuiAPI.HasMasterDetail();
	}

	export function HideOnScroll(): any {
		return {
			init: () => {
				OutSystems.osuiAPI.HideOnScroll.Init();
			},
		};
	}
}
