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
		const content: HTMLElement = OSFramework.Helper.Dom.ClassSelector(
			document,
			OSFramework.GlobalEnum.CssClassElements.Content
		);
		const inputs: NodeListOf<HTMLElement> = document.querySelectorAll(OSFramework.Constants.JustInputs);

		if (inputs.length !== 0) {
			for (let i = inputs.length - 1; i >= 0; i--) {
				inputs[i].style.webkitUserSelect = 'auto';
			}

			if (content) {
				content.addEventListener(OSFramework.GlobalEnum.HTMLEvent.TouchStart, function (e) {
					originalPosition = e.changedTouches[0].pageY;
					for (let i = inputs.length - 1; i >= 0; i--) {
						inputs[i].style.webkitUserSelect = 'auto';
					}
				});

				content.addEventListener(OSFramework.GlobalEnum.HTMLEvent.TouchMove, function (e) {
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

				content.addEventListener(OSFramework.GlobalEnum.HTMLEvent.TouchEnd, function () {
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
	export function RTLObserver(callback: OSFramework.GlobalCallbacks.OSGeneric): MutationObserver {
		const elemToObserve = document.body;
		let hasAlreadyRTL = elemToObserve.classList.contains(OSFramework.Constants.IsRTLClass);

		const observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.attributeName === 'class') {
					const mutationTarget = mutation.target as HTMLElement;
					const hasRTLNow = mutationTarget.classList.contains(OSFramework.Constants.IsRTLClass);
					if (hasAlreadyRTL !== hasRTLNow) {
						hasAlreadyRTL = hasRTLNow;
						OSFramework.Helper.AsyncInvocation(callback);
					}
				}
			});
		});
		observer.observe(elemToObserve, { attributes: true });
		return observer;
	}

	/**
	 * Function used to Set and Update the Device Classes and CSS inline variables to body
	 *
	 * @param IsWebApp
	 *
	 */
	export function SetDeviceClass(IsWebApp: boolean): void {
		const operatingSystem = OSFramework.Helper.DeviceInfo.GetOperatingSystem();
		const body = document.body;

		if (body) {
			// Add operatingSystem class
			if (operatingSystem !== OSFramework.GlobalEnum.MobileOS.Unknown) {
				OSFramework.Helper.Dom.Styles.AddClass(body, operatingSystem);
			}

			// Add iphonex class for ios devices with notch
			if (
				operatingSystem === OSFramework.GlobalEnum.MobileOS.IOS &&
				OSFramework.Helper.DeviceInfo.IsIphoneWithNotch
			) {
				OSFramework.Helper.Dom.Styles.AddClass(body, OSFramework.GlobalEnum.NotchClasses.IPhoneX);
			}

			if (IsWebApp) {
				// if it's a mobile app we do not need to set browser info!
				const browser = OSFramework.Helper.DeviceInfo.GetBrowser();
				if (browser !== OSFramework.GlobalEnum.Browser.unknown) {
					OSFramework.Helper.Dom.Styles.AddClass(body, browser);
				}
				// also same as above!
				if (OSFramework.Helper.DeviceInfo.IsTouch) {
					OSFramework.Helper.Dom.Styles.AddClass(body, OSFramework.GlobalEnum.CssClassElements.IsTouch);
				}
			} else {
				// Detect IpadPro to add desktop class
				if (
					OSFramework.Helper.Dom.Styles.ContainsClass(body, OSFramework.GlobalEnum.DeviceType.phone) ===
						false &&
					OSFramework.Helper.Dom.Styles.ContainsClass(body, OSFramework.GlobalEnum.DeviceType.tablet) ===
						false
				) {
					body.classList.add(OSFramework.GlobalEnum.DeviceType.desktop);
				}
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
				layout.classList.add(OSFramework.GlobalEnum.CssClassElements.HeaderIsVisible);
			} else {
				layout.classList.remove(OSFramework.GlobalEnum.CssClassElements.HeaderIsVisible);
			}
		});

		observer.observe(stickyObserver);
	}
}
