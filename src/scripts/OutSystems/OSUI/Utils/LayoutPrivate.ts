// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.LayoutPrivate {
	export function SetDeviceClass(IsWebApp: boolean): void {
		const operatingSystem = OSUIFramework.Helper.DeviceInfo.GetOperatingSystem();
		const body = document.body;
		if (body) {
			if (operatingSystem !== OSUIFramework.GlobalEnum.MobileOS.Unknown) {
				OSUIFramework.Helper.Dom.Styles.AddClass(body, operatingSystem);
			}
			// Add iphonex class for ios devices with notch
			if (
				operatingSystem === OSUIFramework.GlobalEnum.MobileOS.IOS &&
				OSUIFramework.Helper.DeviceInfo.IsIphoneWithNotch
			) {
				OSUIFramework.Helper.Dom.Styles.AddClass(body, OSUIFramework.GlobalEnum.NotchClasses.IPhoneX);
			}

			if (IsWebApp) {
				const browser = OSUIFramework.Helper.DeviceInfo.GetBrowser();

				if (browser !== OSUIFramework.GlobalEnum.Browser.unknown) {
					OSUIFramework.Helper.Dom.Styles.AddClass(body, browser);
				}

				if (OSUIFramework.Helper.DeviceInfo.IsTouch) {
					OSUIFramework.Helper.Dom.Styles.AddClass(body, 'is--touch');
				}
			} else {
				// Detect IpadPro to add desktop class
				if (
					OSUIFramework.Helper.Dom.Styles.ContainsClass(body, OSUIFramework.GlobalEnum.DeviceType.phone) ===
						false &&
					OSUIFramework.Helper.Dom.Styles.ContainsClass(body, OSUIFramework.GlobalEnum.DeviceType.tablet) ===
						false
				) {
					body.classList.add(OSUIFramework.GlobalEnum.DeviceType.desktop);
				}

				if (
					OSUIFramework.Helper.Dom.Styles.ContainsClass(body, OSUIFramework.GlobalEnum.DeviceType.tablet) ||
					OSUIFramework.Helper.Dom.Styles.ContainsClass(body, OSUIFramework.GlobalEnum.DeviceType.desktop)
				) {
					window.addEventListener('orientationchange', function () {
						setTimeout(function () {
							if (
								OSUIFramework.Helper.Dom.Styles.ContainsClass(
									body,
									OSUIFramework.GlobalEnum.DeviceType.phone
								) === false &&
								OSUIFramework.Helper.Dom.Styles.ContainsClass(
									body,
									OSUIFramework.GlobalEnum.DeviceType.tablet
								) === false
							) {
								body.classList.add(OSUIFramework.GlobalEnum.DeviceType.desktop);
							} else if (
								OSUIFramework.Helper.Dom.Styles.ContainsClass(
									body,
									OSUIFramework.GlobalEnum.DeviceType.desktop
								) &&
								OSUIFramework.Helper.Dom.Styles.ContainsClass(
									body,
									OSUIFramework.GlobalEnum.DeviceType.tablet
								)
							) {
								body.classList.remove(OSUIFramework.GlobalEnum.DeviceType.desktop);
							}
						}, 500);
					});
				}
			}
		}
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
		const content: HTMLElement = OSUIFramework.Helper.Dom.ClassSelector(
			document,
			OSUIFramework.GlobalEnum.CssClassElements.Content
		);
		const inputs: NodeListOf<HTMLElement> = document.querySelectorAll(OSUIFramework.Constants.JustInputs);

		if (inputs.length !== 0) {
			for (let i = inputs.length - 1; i >= 0; i--) {
				inputs[i].style.webkitUserSelect = 'auto';
			}

			if (content) {
				content.addEventListener(OSUIFramework.GlobalEnum.HTMLEvent.TouchStart, function (e) {
					originalPosition = e.changedTouches[0].pageY;
					for (let i = inputs.length - 1; i >= 0; i--) {
						inputs[i].style.webkitUserSelect = 'auto';
					}
				});

				content.addEventListener(OSUIFramework.GlobalEnum.HTMLEvent.TouchMove, function (e) {
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

				content.addEventListener(OSUIFramework.GlobalEnum.HTMLEvent.TouchEnd, function () {
					setTimeout(function () {
						for (let i = inputs.length - 1; i >= 0; i--) {
							inputs[i].style.webkitUserSelect = 'auto';
						}
					}, 0);
				});
			}
		}
	}
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

	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function RTLObserver(callback: OSUIFramework.Callbacks.OSGeneric): MutationObserver {
		const elemToObserve = document.body;
		let hasAlreadyRTL = elemToObserve.classList.contains(OSUIFramework.Constants.IsRTLClass);

		const observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.attributeName === 'class') {
					const mutationTarget = mutation.target as HTMLElement;
					const hasRTLNow = mutationTarget.classList.contains(OSUIFramework.Constants.IsRTLClass);
					if (hasAlreadyRTL !== hasRTLNow) {
						hasAlreadyRTL = hasRTLNow;
						OSUIFramework.Helper.AsyncInvocation(callback);
					}
				}
			});
		});
		observer.observe(elemToObserve, { attributes: true });
		return observer;
	}

	export function SetStickyObserver(): void {
		const layout = document.querySelector('.active-screen .layout');
		const stickyObserver = document.querySelector('.active-screen .sticky-observer');

		const observer = new IntersectionObserver(function (entries) {
			if (entries[0].isIntersecting) {
				layout.classList.add(OSUIFramework.GlobalEnum.CssClassElements.HeaderIsVisible);
			} else {
				layout.classList.remove(OSUIFramework.GlobalEnum.CssClassElements.HeaderIsVisible);
			}
		});

		observer.observe(stickyObserver);
	}
}
