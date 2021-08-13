/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace osui {
	export function GetVersion(): any {
		console.warn('osui.GetVersion(), is deprecated. Please use the API `OutSystems.OSUI.GetVersion()`.');
		return OutSystems.OSUI.GetVersion();
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	export function ToggleClass(el: HTMLElement, state: any, className: string): any {
		console.warn(
			'osui.ToggleClass(...), is deprecated. Please use the API `OutSystems.OSUI.Utils.ToggleClass(...)`.'
		);
		OutSystems.OSUI.Utils.ToggleClass(el, state, className);
	}

	export function GetClosest(elem: HTMLElement, selector: string): any {
		console.warn(
			'osui.GetClosest(...), is deprecated. Please use the API `OutSystems.OSUI.Utils.GetClosest(...)`.'
		);
		return OutSystems.OSUI.Utils.GetClosest(elem, selector);
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function StartMWO(): any {
		//TO BE REMOVED
		OutSystems.OSUI.Utils.StartMadeWithOS();
	}

	export function FixInputs(): any {
		console.warn('osui.FixInputs(...), is deprecated. Please use the API `OutSystems.OSUI.Utils.FixInputs(...)`.');
		OutSystems.OSUI.Utils.FixInputs();
	}

	export function HasMasterDetail(): any {
		console.warn(
			'osui.HasMasterDetail(), is deprecated. Please use the API `OutSystems.OSUI.Utils.HasMasterDetail()`.'
		);
		OutSystems.OSUI.Utils.HasMasterDetail();
	}

	export function HideOnScroll(): any {
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
