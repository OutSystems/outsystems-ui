// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.DeviceDetection {
	/**
	 * Get the current device orientation
	 */
	export function GetDeviceOrientation(): string {
		return OSUIFramework.Helper.DeviceInfo.GetDeviceOrientation();
	}

	/**
	 * Get the current device type
	 */
	export function GetDeviceType(): string {
		return OSUIFramework.Helper.DeviceInfo.GetDeviceType();
	}

	/**
	 * Identifies if the device has a touchscreen.
	 */
	export function IsTouch(): boolean {
		return OSUIFramework.Helper.DeviceInfo.IsTouch;
	}

	/**
	 * Identifies the operating system being used.
	 * @param UserAgent
	 * @returns
	 */
	export function GetOperatingSystem(UserAgent: string): string {
		return OSUIFramework.Helper.DeviceInfo.GetOperatingSystem(UserAgent);
	}

	/**
	 * Checks if the current device is desktop
	 * @returns
	 */
	export function IsDesktop(): boolean {
		return OSUIFramework.Helper.DeviceInfo.IsDesktop;
	}

	/**
	 * Checks if is the layout native is being used
	 * @returns
	 */
	export function CheckIsLayoutNative(): boolean {
		const layout = OSUIFramework.Helper.Dom.ClassSelector(
			document.body,
			OSUIFramework.GlobalEnum.CssClassElements.Layout
		);

		if (layout) {
			const isNative = OSUIFramework.Helper.Dom.Styles.ContainsClass(
				layout,
				OSUIFramework.GlobalEnum.CssClassElements.LayoutNative
			);
			return isNative;
		}
	}

	/**
	 * Checks if running as PWA.
	 * @returns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function IsRunningAsPWA(): boolean {
		return OSUIFramework.Helper.DeviceInfo.IsPwa;
	}

	/**
	 * Checks if the current device is phone
	 * @returns
	 */
	export function IsPhone(): boolean {
		return OSUIFramework.Helper.DeviceInfo.IsPhone;
	}

	/**
	 * Action to check if App is currently running as a Native App.
	 * @returns
	 */
	export function IsRunningAsNativeApp(): boolean {
		return OSUIFramework.Helper.DeviceInfo.IsNative;
	}

	/**
	 * Checks if the current device is tablet
	 * @returns
	 */
	export function IsTablet(): boolean {
		return OSUIFramework.Helper.DeviceInfo.IsTablet;
	}

	/**
	 * Returns true if using a WebApp Template
	 * @returns
	 */
	export function IsWebApp(): boolean {
		const layout = OSUIFramework.Helper.Dom.ClassSelector(
			document.body,
			OSUIFramework.GlobalEnum.CssClassElements.Layout
		);
		if (layout) {
			const isNotOldNativeLayouts =
				OSUIFramework.Helper.Dom.TagSelector(document.body, '.active-screen .layout.layout-top') ||
				OSUIFramework.Helper.Dom.TagSelector(document.body, '.active-screen .layout.layout-side') ||
				OSUIFramework.Helper.Dom.TagSelector(document.body, '.active-screen .layout.blank') ||
				OSUIFramework.Helper.Dom.TagSelector(document.body, '.active-screen .layout.layout-blank');

			return isNotOldNativeLayouts && CheckIsLayoutNative() === false;
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
					? OSUIFramework.GlobalEnum.DeviceOrientation.landscape
					: OSUIFramework.GlobalEnum.DeviceOrientation.portrait;
			const isLandscape = orient === OSUIFramework.GlobalEnum.DeviceOrientation.landscape;

			const userValues = {
				phone: phoneWidth,
				tablet: tabletWidth,
			};

			const phoneMax = userValues.phone ? userValues.phone : 700;
			const tabletMax = userValues.tablet ? userValues.tablet : 1024;

			const deviceList = [
				OSUIFramework.GlobalEnum.DeviceType.phone,
				OSUIFramework.GlobalEnum.DeviceType.tablet,
				OSUIFramework.GlobalEnum.DeviceType.desktop,
			];

			let device;
			if (windowWidth < phoneMax || (isLandscape === false && windowHeight < phoneMax)) {
				//Is phone!
				device = 0;
			} else if (
				(windowWidth >= phoneMax && windowWidth <= tabletMax) ||
				(windowHeight >= phoneMax && windowHeight <= tabletMax && isLandscape)
			) {
				//Is Tablet!
				device = 1;
			} else if (windowWidth > tabletMax || (windowHeight > tabletMax && isLandscape)) {
				//Is Desktop!
				device = 2;
			}

			return [orient, deviceList[device]];
		};
	}
}
