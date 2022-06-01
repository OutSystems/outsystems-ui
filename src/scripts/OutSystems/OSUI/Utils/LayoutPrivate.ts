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

	//TODO - This is not being used.
	// We need to check if the client action is needed on the current version
	export function IphoneXpreview(): void {
		const previewCss = `
            /* iPhoneX Preview in Devices */
            ._phantom-limb .iphonex.portrait .layout-native:not(.blank) .content {
                padding-top: calc(var(--header-size) + var(--header-size-content) + 35px);
                padding-bottom: var(--footer-height);
            }
            
            ._phantom-limb .iphonex.portrait .layout-native.hide-header-on-scroll .header {
                top: calc(-1 * (var(--header-size) + 35px));
            }
            
            ._phantom-limb .iphonex.portrait .layout-native.hide-header-on-scroll.header-is--visible .header-top-content {
            padding-top: 0; 
            }
            
            ._phantom-limb .iphonex.portrait .layout-native.hide-header-on-scroll .header-top-content {
            padding-top: 35px; 
            }
            
            ._phantom-limb .iphonex.portrait .layout-native.hide-header-on-scroll .content {
                padding-top: 0;
            }
            
            ._phantom-limb .iphonex.landscape .layout-native .content {
                padding-left: 35px;
                padding-right: 35px;
            }
            
            .iphonex .bottom-bar-wrapper {    
                padding-bottom: 5px;    
            }
            
            .iphonex .action-sheet {
                padding-bottom: 35px; 
            }
            
            .iphonex .split-right-close a,
            .split-right-close a:link,
            .split-right-close a:visited {
                color: var(--color-neutral-8);
            }
            
            /* portrait only */
            .iphonex.portrait .header,
            .iphonex.portrait .app-menu-content,
            .iphonex.portrait .notification {
                padding-top: 35px;
            }
            
            .iphonex.portrait .notification--visible {
                margin-top: 35px;
            }
            
            .iphonex.portrait .app-menu,
            .iphonex.portrait .sidebar {
                padding-top: 35px;
                padding-bottom: 5px;
            }
            
            .iphonex.portrait .section-group.is--sticky .section-title {
                top: calc(var(--section-top-position) + 35px);
            }
            
            .iphonex.portrait .section-index.is--sticky {
                top: calc(var(--header-size) + var(--header-size-content) + var(--top-position) + 35px);
            }
            
            .iphonex.ios.phone.portrait .layout-native .floating-actions-wrapper {
                margin-bottom: 16px;
            }
            
            .iphonex.ios.phone.portrait .layout-native .floating-actions-wrapper.bottom-bar-exists {
                margin-bottom: 0;
            }
            
            .iphonex.portrait .layout-native .split-right {
                padding-top: calc(var(--header-size) + var(--header-size-content) + 35px);
            }
            
            .iphonex.ios.phone.portrait .layout-native .split-right-close {
                top: 47px;
            }
            
            .iphonex.portrait .split-right-close {
                top: 41px;
            }
            
            .iphonex.portrait .header-right .search-input {
                padding-top: 40px;
            }
            
            .iphonex.portrait .header-right .search-input:after {
                top: 50px; 
            }
            
            .iphonex.portrait .feedback-message {
                padding-top: 45px;
            }
            
            /* landscape */
            .iphonex.landscape .app-menu,
            .iphonex.landscape .sidebar {
                padding-bottom: 5px;
            }
            
            .iphonex.landscape .app-menu-links {
                padding-left: 35px; 
            }
            
            .iphonex.landscape .header,
            .iphonex.landscape .main-content,
            .iphonex.landscape .bottom-bar-wrapper {
                padding-left: 35px;
                padding-right: 35px;
            }
            
            .iphonex.ios.phone.landscape .layout-native .split-right-close {
                display: block;
            }
            
            .ios.phone.landscape .layout-native .floating-actions-wrapper {
                margin-right: calc(35px + var(--space-base));
            }
        `;

		const generalCss = `
            /* General Devices Preview */
            ._phantom-limb body {
                overflow: initial !important;
            }
            
            ._phantom-limb .layout-native.hide-header-on-scroll .header {
                position: sticky;
            }
            
            ._phantom-limb .layout-native.hide-header-on-scroll .content {
                padding-top: 0;
            }
            
            ._phantom-limb .layout-native:not(.hide-header-on-scroll) .header {
                top: 0;
            }
            
            ._phantom-limb .layout-native .footer {
                bottom: 0;
            }
            
            ._phantom-limb .layout-native .header,
            ._phantom-limb .layout-native .footer {
                position: fixed;
                left: 0;
                right: 0;
            }
            
            ._phantom-limb .layout-native .footer {
                bottom: 0;
            }
            
            ._phantom-limb .layout-native:not(.blank) .content {
                padding-top: calc(var(--header-size) + var(--header-size-content));
                padding-bottom: var(--footer-height);
            }
            
            ._phantom-limb .landscape .layout.layout-side.layout-native .header {
                z-index: 150;
            }
            
            ._phantom-limb .landscape.phone.tablet.windows .layout-native .split-right-close {
                display: block;
            }
            
            ._phantom-limb .split-right-close a,
            ._phantom-limb .split-right-close a:link,
            ._phantom-limb .split-right-close a:visited {
                color: var(--color-neutral-8);
            }
        `;
		const body = document.querySelector('body');
		let isIframe;
		let isPreviewInDevices;

		// detect Preview in Devices
		function detectPreviewInDevices() {
			isIframe = window.self !== window.top;

			try {
				if (isIframe) {
					isPreviewInDevices = window.top.document.querySelector('.marvel-device') !== null;
				}
			} catch (e) {
				isPreviewInDevices = false;
			}

			if (isPreviewInDevices) {
				if (
					window.top.document.querySelector('.marvel-device').classList.contains('iphone-x') ||
					window.top.document.querySelector('.marvel-device').classList.contains('iphone12mini') ||
					window.top.document.querySelector('.marvel-device').classList.contains('iphone12pro') ||
					window.top.document.querySelector('.marvel-device').classList.contains('iphone12max')
				) {
					body.classList.add('ios');
					body.classList.add('iphonex');
				}

				// check if sticky-observer is available and call the action for Preview in Devices
				if (document.querySelector('._phantom-limb .active-screen .sticky-observer')) {
					SetStickyObserver();
				}

				addGeneralPreview();
			}
		}

		// Holds the logic to add or not the iPhoneX css preview
		function addGeneralPreview() {
			const stylesEl = document.getElementById('preview-css');
			let css;

			if (stylesEl === null) {
				if (
					window.top.document.querySelector('.marvel-device').classList.contains('iphone-x') ||
					window.top.document.querySelector('.marvel-device').classList.contains('iphone12mini') ||
					window.top.document.querySelector('.marvel-device').classList.contains('iphone12pro') ||
					window.top.document.querySelector('.marvel-device').classList.contains('iphone12max')
				) {
					css = previewCss + generalCss;
				} else {
					css = generalCss;
				}

				const style = document.createElement('style');
				style.type = 'text/css';
				style.id = 'preview-css';
				style.appendChild(document.createTextNode(css));

				document.body.appendChild(style);
			}
		}

		detectPreviewInDevices();
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
