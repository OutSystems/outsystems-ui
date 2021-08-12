/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace osui {
	export function GetVersion(): any {
		return OutSystems.OSUI.GetVersion();
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	export function ToggleClass(el: HTMLElement, state: any, className: string): any {
		OSUIFramework.Utils.ToggleClass(el, state, className);
	}

	export function GetClosest(elem: HTMLElement, selector: string): any {
		return OSUIFramework.Utils.GetClosest(elem, selector);
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function StartMWO(): any {
		OSUIFramework.Utils.StartMadeWithOS();
	}

	export function FixInputs(): any {
		OSUIFramework.Utils.FixInputs();
	}

	export function HasMasterDetail(): any {
		OSUIFramework.Utils.HasMasterDetail();
	}

	export function HideOnScroll(): any {
		return {
			init: () => {
				OSUIFramework.Utils.HideOnScroll.Init();
			},
		};
	}
}
