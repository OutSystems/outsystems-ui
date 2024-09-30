// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace osui {
	/**
	 * @deprecated use 'OutSystems.OSUI.GetVersion()' instead.
	 */
	export function GetVersion(): string {
		console.warn('osui.GetVersion(), is deprecated. Please use the API `OutSystems.OSUI.GetVersion()`.');
		return OutSystems.OSUI.GetVersion();
	}

	/**
	 * @deprecated use 'OutSystems.OSUI.Utils.ToggleClass(...)' instead.
	 */
	export function ToggleClass(el: HTMLElement, state: unknown, className: string): void {
		console.warn(
			'osui.ToggleClass(...), is deprecated. Please use the API `OutSystems.OSUI.Utils.ToggleClass(...)`.'
		);
		OutSystems.OSUI.Utils.ToggleClass(el, state, className);
	}

	/**
	 * @deprecated use 'OutSystems.OSUI.GetVersion()' instead.
	 */
	export function GetClosest(elem: HTMLElement, selector: string): unknown {
		console.warn(
			'osui.GetClosest(...), is deprecated. Please use the API `OutSystems.OSUI.Utils.GetClosest(...)`.'
		);
		return OutSystems.OSUI.Utils.GetClosest(elem, selector);
	}

	/**
	 * @deprecated use 'OutSystems.OSUI.Utils.FixInputs(...)' instead.
	 */
	export function FixInputs(): void {
		console.warn('osui.FixInputs(...), is deprecated. Please use the API `OutSystems.OSUI.Utils.FixInputs(...)`.');
		OutSystems.OSUI.Utils.LayoutPrivate.FixInputs();
	}

	/**
	 * @deprecated use 'OutSystems.OSUI.Utils.HasMasterDetail()' instead.
	 */
	export function HasMasterDetail(): boolean {
		console.warn(
			'osui.HasMasterDetail(), is deprecated. Please use the API `OutSystems.OSUI.Utils.HasMasterDetail()`.'
		);
		return OutSystems.OSUI.Utils.HasMasterDetail();
	}

	/**
	 * @deprecated use 'OutSystems.OSUI.Utils.HideOnScroll.Init()' instead.
	 */
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

namespace OutSystems.OSUI.Utils.Menu {
	/**
	 * @deprecated use 'OutSystems.OSUI.Utils.Menu.OnReady(...)' instead.
	 */
	export function AddMenuOnOrientationChange(callback: OSFramework.OSUI.GlobalCallbacks.Generic): void {
		console.warn(
			'OutSystems.OSUI.Utils.Menu.AddMenuOnOrientationChange(...), is deprecated. Please use the API `OutSystems.OSUI.Utils.Menu.OnReady(...)`.'
		);
		return OutSystems.OSUI.Utils.Menu.addMenuOnOrientationChange(callback);
	}

	/**
	 * @deprecated use 'OutSystems.OSUI.Utils.Menu.OnDestroy()' instead.
	 */
	export function RemoveMenuOnOrientationChange(): void {
		console.warn(
			'OutSystems.OSUI.Utils.Menu.RemoveMenuOnOrientationChange(), is deprecated. Please use the API `OutSystems.OSUI.Utils.Menu.OnDestroy()`.'
		);
		return OutSystems.OSUI.Utils.Menu.removeMenuOnOrientationChange();
	}
}
