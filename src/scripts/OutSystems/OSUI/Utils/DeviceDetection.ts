// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.DeviceDetection {
	/**
	 * Get the current device orientation
	 */
	export function GetDeviceOrientation(): string {
		return OSFramework.OSUI.Helper.DeviceInfo.GetDeviceOrientation();
	}

	/**
	 * Get the current device type
	 */
	export function GetDeviceType(): string {
		return OSFramework.OSUI.Helper.DeviceInfo.GetDeviceType();
	}

	/**
	 * Identifies if the device has a touchscreen.
	 */
	export function IsTouch(): boolean {
		return OSFramework.OSUI.Helper.DeviceInfo.IsTouch;
	}

	/**
	 * Identifies the operating system being used.
	 * @param UserAgent
	 * @returns
	 */
	export function GetOperatingSystem(UserAgent: string): string {
		return OSFramework.OSUI.Helper.DeviceInfo.GetOperatingSystem(UserAgent);
	}

	/**
	 * Checks if the current device is desktop
	 * @returns
	 */
	export function IsDesktop(): boolean {
		return OSFramework.OSUI.Helper.DeviceInfo.IsDesktop;
	}

	/**
	 * Checks if is the layout native is being used
	 * @returns
	 */
	export function CheckIsLayoutNative(): boolean {
		const layout = OSFramework.OSUI.Helper.Dom.ClassSelector(
			document.body,
			OSFramework.OSUI.GlobalEnum.CssClassElements.Layout
		);

		if (layout) {
			return OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
				layout,
				OSFramework.OSUI.GlobalEnum.CssClassElements.LayoutNative
			);
		} else {
			return false;
		}
	}

	/**
	 * Checks if is the layout side menu is being used
	 * @returns
	 */
	export function CheckIsLayoutSide(): boolean {
		const layout = OSFramework.OSUI.Helper.Dom.ClassSelector(
			document.body,
			OSFramework.OSUI.GlobalEnum.CssClassElements.Layout
		);

		if (layout) {
			return OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
				layout,
				OSFramework.OSUI.GlobalEnum.CssClassElements.LayoutSide
			);
		} else {
			return false;
		}
	}

	/**
	 * Checks if running as PWA.
	 * @returns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function IsRunningAsPWA(): boolean {
		return OSFramework.OSUI.Helper.DeviceInfo.IsPwa;
	}

	/**
	 * Checks if the current device is phone
	 * @returns
	 */
	export function IsPhone(): boolean {
		return OSFramework.OSUI.Helper.DeviceInfo.IsPhone;
	}

	/**
	 * Action to check if App is currently running as a Native App.
	 * @returns
	 */
	export function IsRunningAsNativeApp(): boolean {
		return OSFramework.OSUI.Helper.DeviceInfo.IsNative;
	}

	/**
	 * Checks if the current device is tablet
	 * @returns
	 */
	export function IsTablet(): boolean {
		return OSFramework.OSUI.Helper.DeviceInfo.IsTablet;
	}

	/**
	 * Returns true if using a WebApp Template
	 * @returns
	 */
	export function IsWebApp(): boolean {
		const layout = OSFramework.OSUI.Helper.Dom.ClassSelector(
			document.body,
			OSFramework.OSUI.GlobalEnum.CssClassElements.Layout
		);
		if (layout) {
			const isNotOldNativeLayouts =
				OSFramework.OSUI.Helper.Dom.TagSelector(document.body, '.active-screen .layout.layout-top') ||
				OSFramework.OSUI.Helper.Dom.TagSelector(document.body, '.active-screen .layout.layout-side') ||
				OSFramework.OSUI.Helper.Dom.TagSelector(document.body, '.active-screen .layout.blank') ||
				OSFramework.OSUI.Helper.Dom.TagSelector(document.body, '.active-screen .layout.layout-blank');

			return !!isNotOldNativeLayouts && CheckIsLayoutNative() === false;
		} else {
			return false;
		}
	}
	/**
	 * Register a function that provides a list of classes to apply to the document body.
	 * Expected classes to be returned are portrait or landscape — for orientation — and phone or tablet for device type. The method provided may emit other classes.
	 *
	 * @export
	 * @param {number} phoneWidth
	 * @param {number} tabletWidth
	 */
	export function SetDeviceBreakpoints(phoneWidth: number, tabletWidth: number): void {
		// @ts-expect-error: this the way to interact with the active view component
		return function () {
			const windowWidth = window.innerWidth || document.documentElement.clientWidth;
			const windowHeight = window.innerHeight || document.documentElement.clientHeight;
			const orient =
				windowWidth > windowHeight
					? OSFramework.OSUI.GlobalEnum.DeviceOrientation.landscape
					: OSFramework.OSUI.GlobalEnum.DeviceOrientation.portrait;

			const userValues = {
				phone: phoneWidth,
				tablet: tabletWidth,
			};

			const phoneMax = userValues.phone ? userValues.phone : 700;
			const tabletMax = userValues.tablet ? userValues.tablet : 1024;

			const deviceList = [
				OSFramework.OSUI.GlobalEnum.DeviceType.phone,
				OSFramework.OSUI.GlobalEnum.DeviceType.tablet,
				OSFramework.OSUI.GlobalEnum.DeviceType.desktop,
			];

			let device;

			if (windowWidth <= phoneMax) {
				//Is phone!
				device = 0;
			} else if (windowWidth <= tabletMax) {
				//Is Tablet!
				device = 1;
			} else {
				//Is Desktop!
				device = 2;
			}

			return [orient, deviceList[device]];
		};
	}
}
