// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.PreviewInDevices {
	/**
	 * Responsible for handling the Preview In Device behavior.
	 *
	 * @abstract
	 * @class OnPostMessage
	 */
	abstract class OnPostMessage {
		// Holds the knowledge if the app is running within the Preview In Devices in ODC.
		private static _isInPreviewInDevices = false;

		// Adds a CSS class to the body to make it easily style accordingly.
		private static _addInPreviewCssClass(): void {
			OnPostMessage._isInPreviewInDevices = true;
			document.body.classList.add('PreviewInDevices');
		}

		// Creates the CSS overrides for the Preview In Devices in ODC
		private static _createPhonePreviewStyle(notchValue: number) {
			if (!notchValue) {
				return;
			}

			const style = document.createElement('style');

			style.textContent = `
				body * {
					user-select: none !important
				}
	
				body.is-phone.android.portrait {
					--status-bar-height: ${notchValue}px;
				} 
				
				body.portrait.is-phone {
					--os-safe-area-top: ${notchValue}px;
				} 
				
				body.landscape.is-phone {
					--os-safe-area-right: ${notchValue}px;
					--os-safe-area-left: ${notchValue}px;
				}
	
				.is-phone .active-screen.screen-container::-webkit-scrollbar, html::-webkit-scrollbar,
				.is-phone.ios .active-screen.screen-container .content::-webkit-scrollbar, html::-webkit-scrollbar {
					display: none;
				}
			`;

			// Adds the is phone class to apply the correct styling
			// because platform is replacing phone with tablet when we rotate the phone device
			document.body.classList.add('is-phone');
			document.body.setAttribute('data-status-bar-height', `${notchValue}px`);
			document.head.appendChild(style);
		}

		// Creates the CSS overrides for the Preview In Devices in ODC
		private static _createTabletPreviewStyle() {
			const style = document.createElement('style');
			style.textContent = `
				body * {
					user-select: none !important
				}
				
				.tablet .active-screen.screen-container::-webkit-scrollbar, html::-webkit-scrollbar,
				.tablet.ios .active-screen.screen-container .content::-webkit-scrollbar, html::-webkit-scrollbar {
					display: none;
				}
			`;

			document.head.appendChild(style);
		}

		// Method that handles the message event, sent by Preview In Devices in ODC
		private static _message(evtName: string, evt: MessageEvent): void {
			if (
				OSFramework.OSUI.GlobalEnum.HTMLEvent.Message === evtName &&
				(evt.origin.includes('outsystems.app') || evt.origin.includes('outsystems.dev'))
			) {
				OnPostMessage._messageFromPreview(evt);
			}
		}

		// Adds the required CSS classes and CSS overrides so that the application adapts correctly to the device selected in the Preview In Devices in ODC
		private static _messageFromPreview(evt: MessageEvent<IDataPreviewInDevice>): void {
			OnPostMessage._addInPreviewCssClass();
			if (OSFramework.OSUI.Helper.DeviceInfo.IsPhone) {
				OnPostMessage._createPhonePreviewStyle(evt.data.notchValue);
			} else if (OSFramework.OSUI.Helper.DeviceInfo.IsTablet) {
				OnPostMessage._createTabletPreviewStyle();
			}
			sessionStorage.setItem('previewDevicesUserAgent', evt.data.userAgent);
			sessionStorage.setItem('previewDevicesPixelRatio', evt.data.pixelRatio);
			OnPostMessage.Unset();
			evt.source.postMessage('received', { targetOrigin: evt.origin });
			OSFramework.OSUI.Helper.DeviceInfo.RefreshOperatingSystem();
			LayoutPrivate.SetDeviceClass(false);
		}

		/**
		 * Indicates if the APP is running within the Preview In Devices frame.
		 *
		 * @readonly
		 * @static
		 * @type {boolean}
		 * @memberof OnPostMessage
		 */
		public static get IsInPreviewInDevices(): boolean {
			return OnPostMessage._isInPreviewInDevices;
		}

		/**
		 * Method used to set the message event
		 *
		 * @static
		 * @memberof OnPostMessage
		 */
		public static Set(): void {
			if (window.self !== window.top) {
				OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
					OSFramework.OSUI.Event.DOMEvents.Listeners.Type.WindowMessage,
					OnPostMessage._message
				);
			}
		}

		/**
		 * Method used to unset the message event
		 *
		 * @static
		 * @memberof OnPostMessage
		 */
		public static Unset(): void {
			OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				OSFramework.OSUI.Event.DOMEvents.Listeners.Type.WindowMessage,
				OnPostMessage._message
			);
		}
	}

	// Invoke the event register
	OnPostMessage.Set();
}
