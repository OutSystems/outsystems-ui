// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.LayoutPrivate {
	/**
	 * Function used to unset all the events has been added at the OnDestroy Layout
	 */
	export function Dispose(): void {
		// Remove the onOrientationChange Event
		LayoutPrivate.OnOrientationChange.Unset();
	}

	/**
	 * Function used to Fix Inputs for iOS devices
	 *
	 * @export
	 *
	 * ToDo:
	 * 	- Check this function since this method is used at LayoutReady and LayoutReadyMobile but both of this
	 * client actions are not in use by us!
	 *  - Check the fact that webkitUserSelect prop is also deprecated!
	 */
	//TODO: Is this function necessary?
	export function FixInputs(): void {
		let originalPosition = 0;
		let currentPosition = 0;
		const content: HTMLElement = OSFramework.OSUI.Helper.Dom.ClassSelector(
			document,
			OSFramework.OSUI.GlobalEnum.CssClassElements.Content
		);
		const inputs: NodeListOf<HTMLElement> = document.querySelectorAll(OSFramework.OSUI.Constants.JustInputs);

		if (inputs.length !== 0) {
			for (let i = inputs.length - 1; i >= 0; i--) {
				inputs[i].style.webkitUserSelect = 'auto';
			}

			if (content) {
				content.addEventListener(OSFramework.OSUI.GlobalEnum.HTMLEvent.TouchStart, function (e) {
					originalPosition = e.changedTouches[0].pageY;
					for (let i = inputs.length - 1; i >= 0; i--) {
						inputs[i].style.webkitUserSelect = 'auto';
					}
				});

				content.addEventListener(OSFramework.OSUI.GlobalEnum.HTMLEvent.TouchMove, function (e) {
					currentPosition = e.touches[0].pageY;
					if (Math.abs(originalPosition - currentPosition) > 10) {
						for (let i = inputs.length - 1; i >= 0; i--) {
							inputs[i].style.webkitUserSelect = 'none';
						}
					} else {
						for (let i = inputs.length - 1; i >= 0; i--) {
							inputs[i].style.webkitUserSelect = 'auto';
						}
					}
				});

				content.addEventListener(OSFramework.OSUI.GlobalEnum.HTMLEvent.TouchEnd, function () {
					setTimeout(function () {
						for (let i = inputs.length - 1; i >= 0; i--) {
							inputs[i].style.webkitUserSelect = 'auto';
						}
					}, 0);
				});
			}
		}
	}

	/**
	 * Function used to set HideHeader on Scroll
	 *
	 * @param HideHeader
	 */
	export function HideHeader(HideHeader: boolean): void {
		if (HideHeader) {
			// window.performance.timing is deprecated but the technology that MDN suggest to use is stil experimental and does not work on IE and Safari. Please visit the following link for context:
			// https://developer.mozilla.org/en-US/docs/Web/API/Performance/timing
			const loadTime =
				window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;

			setTimeout(function () {
				OSUI.Utils.HideOnScroll.Init();
			}, loadTime);
		}
	}

	/**
	 * Function used to set the RTL observer
	 *
	 * @param callback
	 * @returns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function RTLObserver(callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): void {
		console.warn(
			`This method is deprecated. Use instead the API OSFramework.OSUI.Event.DOMEvents.Observers.GlobalObserverManager.Instance.addHandler`
		);
		OSFramework.OSUI.Event.DOMEvents.Observers.GlobalObserverManager.Instance.addHandler(
			OSFramework.OSUI.Event.DOMEvents.Observers.ObserverEvent.RTL,
			callback
		);
	}

	/**
	 * Function used to Set and Update the Device Classes and CSS inline variables to body
	 *
	 * @param IsWebApp
	 *
	 */
	export function SetDeviceClass(IsWebApp: boolean): void {
		const operatingSystem = OSFramework.OSUI.Helper.DeviceInfo.GetOperatingSystem();
		const body = document.body;

		if (body) {
			// Add operatingSystem class
			if (operatingSystem !== OSFramework.OSUI.GlobalEnum.MobileOS.Unknown) {
				OSFramework.OSUI.Helper.Dom.Styles.AddClass(body, operatingSystem);
			}

			// Add iphonex class for ios devices with notch
			if (
				operatingSystem === OSFramework.OSUI.GlobalEnum.MobileOS.IOS &&
				OSFramework.OSUI.Helper.DeviceInfo.IsIphoneWithNotch
			) {
				OSFramework.OSUI.Helper.Dom.Styles.AddClass(body, OSFramework.OSUI.GlobalEnum.NotchClasses.IPhoneX);
			}

			if (IsWebApp) {
				// if it's a mobile app we do not need to set browser info!
				const browser = OSFramework.OSUI.Helper.DeviceInfo.GetBrowser();
				if (browser !== OSFramework.OSUI.GlobalEnum.Browser.unknown) {
					OSFramework.OSUI.Helper.Dom.Styles.AddClass(body, browser);
				}
				// also same as above!
				if (OSFramework.OSUI.Helper.DeviceInfo.IsTouch) {
					OSFramework.OSUI.Helper.Dom.Styles.AddClass(
						body,
						OSFramework.OSUI.GlobalEnum.CssClassElements.IsTouch
					);
				}
			} else {
				// Detect IpadPro to add desktop class
				if (
					OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
						body,
						OSFramework.OSUI.GlobalEnum.DeviceType.phone
					) === false &&
					OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
						body,
						OSFramework.OSUI.GlobalEnum.DeviceType.tablet
					) === false
				) {
					body.classList.add(OSFramework.OSUI.GlobalEnum.DeviceType.desktop);
				}
			}

			/* To fix an issue when: 
				- The user is using a device with an Arabic Language
				- The application IS NOT usgin the Arabic Language

				That makes date type inputs to loose the date format and show the date in the wrong format,
				We must force the text direction to RTL at the input in order to fix it.
				
				More info about this, at release note: ROU-11464
			*/
			// Check if device is configured with RTL language
			if (OSFramework.OSUI.Helper.DeviceInfo.IsRtlLang) {
				// Add the RTL class to the DatePicker input
				OSFramework.OSUI.Helper.Dom.Styles.AddClass(body, OSFramework.OSUI.Constants.IsRTLDeviceType);
			}

			// Set the orientation change event
			LayoutPrivate.OnOrientationChange.Set();
		}
	}

	/**
	 * Function used to set the IntersectionObserver in order to manage if the header is visible
	 */
	export function SetStickyObserver(): void {
		const layout = document.querySelector('.active-screen .layout');
		const stickyObserver = document.querySelector('.active-screen .sticky-observer');

		const observer = new IntersectionObserver(function (entries) {
			if (entries[0].isIntersecting) {
				layout.classList.add(OSFramework.OSUI.GlobalEnum.CssClassElements.HeaderIsVisible);
			} else {
				layout.classList.remove(OSFramework.OSUI.GlobalEnum.CssClassElements.HeaderIsVisible);
			}
		});

		observer.observe(stickyObserver);
	}
}
