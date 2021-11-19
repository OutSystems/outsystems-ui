// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	enum UAKeyword {
		chrome = 'chrome',
		crios = 'crios',
		edge = 'edge',
		edgios = 'edgios',
		edga = 'edga',
		edg = 'edg/',
		firefox = 'firefox',
		fxios = 'fxios',
		kindle = 'kindle',
		silk = 'silk',
		kfapwa = 'kfapwa',
		kfapwi = 'kfapwi',
		kfjwa = 'kfjwa',
		kfjwi = 'kfjwi',
		kfsowi = 'kfsowi',
		kftt = 'kftt',
		kfot = 'kfot',
		kfthwa = 'kfthwa',
		kfthwi = 'kfthwi',
		miuibrowser = 'miuibrowser',
		msie = 'msie',
		opera = 'opera',
		opr = 'opr',
		opios = 'opios',
		safari = 'safari',
		samsungbrowser = 'samsungbrowser',
		trident = 'trident',
		ucbrowser = 'ucbrowser',
		yabrowser = 'yabrowser',
	}

	enum Browser {
		chrome = 'chrome',
		edge = 'edge',
		firefox = 'firefox',
		ie = 'ie',
		kindle = 'kindle',
		miui = 'miui',
		opera = 'opera',
		safari = 'safari',
		samsung = 'samsung',
		uc = 'uc',
		unknown = 'unknown',
		yandex = 'yandex',
	}

	enum DeviceOrientation {
		landscape = 'landscape',
		portrait = 'portrait',
		unknown = 'unknown',
	}

	enum DeviceType {
		desktop = 'desktop',
		phone = 'phone',
		tablet = 'tablet',
	}

	export abstract class DeviceInfo {
		private static _isPwa: boolean | undefined = undefined;
		private static _isTouch: boolean | undefined = undefined;

		private static _isChrome(ua: string): boolean {
			return ua.includes(UAKeyword.chrome) || ua.includes(UAKeyword.crios);
		}

		private static _isEdge(ua: string): boolean {
			return (
				ua.includes(UAKeyword.edge) ||
				ua.includes(UAKeyword.edgios) ||
				ua.includes(UAKeyword.edga) ||
				ua.includes(UAKeyword.edg)
			);
		}

		private static _isFirefox(ua: string): boolean {
			return ua.includes(UAKeyword.firefox) || ua.includes(UAKeyword.fxios);
		}

		// eslint-disable-next-line @typescript-eslint/naming-convention
		private static _isIE(ua: string): boolean {
			return ua.includes(UAKeyword.trident) || ua.includes(UAKeyword.msie);
		}

		private static _isKindle(ua: string): boolean {
			return (
				ua.includes(UAKeyword.kindle) ||
				ua.includes(UAKeyword.silk) ||
				ua.includes(UAKeyword.kftt) ||
				ua.includes(UAKeyword.kfot) ||
				ua.includes(UAKeyword.kfjwa) ||
				ua.includes(UAKeyword.kfjwi) ||
				ua.includes(UAKeyword.kfsowi) ||
				ua.includes(UAKeyword.kfthwa) ||
				ua.includes(UAKeyword.kfthwi) ||
				ua.includes(UAKeyword.kfapwa) ||
				ua.includes(UAKeyword.kfapwi)
			);
		}

		private static _isMiui(ua: string): boolean {
			return ua.includes(UAKeyword.miuibrowser);
		}

		private static _isOpera(ua: string): boolean {
			return ua.includes(UAKeyword.opr) || ua.includes(UAKeyword.opera) || ua.includes(UAKeyword.opios);
		}

		private static _isSamsung(ua: string): boolean {
			return ua.includes(UAKeyword.samsungbrowser);
		}

		// eslint-disable-next-line @typescript-eslint/naming-convention
		private static _isUC(ua: string): boolean {
			return ua.includes(UAKeyword.ucbrowser);
		}
		private static _isYandex(ua: string): boolean {
			return ua.includes(UAKeyword.yabrowser);
		}

		/* PUBLIC GETTERS */

		public static get IsDesktop(): boolean {
			return DeviceInfo.GetDeviceType() === DeviceType.desktop;
		}

		public static get IsPhone(): boolean {
			return DeviceInfo.GetDeviceType() === DeviceType.phone;
		}

		public static get IsTablet(): boolean {
			return DeviceInfo.GetDeviceType() === DeviceType.tablet;
		}

		public static get IsPwa(): boolean {
			if (DeviceInfo._isPwa === undefined) {
				DeviceInfo._isPwa =
					(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
					window.navigator.standalone === true;
			}
			return DeviceInfo._isPwa;
		}

		public static get IsNative(): boolean {
			return window.cordova !== undefined && !DeviceInfo.IsPwa;
		}

		public static get IsTouch(): boolean {
			if (DeviceInfo._isTouch === undefined) {
				if (window.PointerEvent && 'maxTouchPoints' in navigator) {
					// if Pointer Events are supported, just check maxTouchPoints
					DeviceInfo._isTouch = navigator.maxTouchPoints > 0;
				} else {
					// no Pointer Events...
					// check for any-pointer:coarse which mostly means touchscreen
					DeviceInfo._isTouch = window.matchMedia && window.matchMedia('(any-pointer:coarse)').matches;

					if (!DeviceInfo._isTouch) {
						// last resort - check for exposed touch events API / event handler
						DeviceInfo._isTouch = !!(window.TouchEvent || 'ontouchstart' in window);
					}
				}
			}
			return DeviceInfo._isTouch;
		}

		/* PUBLIC METHODS */

		public static GetBrowser(useragent = ''): Browser {
			const useragentLocal =
				useragent.replace(' ', '') === '' ? window.navigator.userAgent.toLowerCase() : useragent.toLowerCase();

			let browser = Browser.unknown;

			//The order of the ifs should be kept until chrome
			if (DeviceInfo._isKindle(useragentLocal)) browser = Browser.kindle;
			else if (DeviceInfo._isOpera(useragentLocal)) browser = Browser.opera;
			else if (DeviceInfo._isEdge(useragentLocal)) browser = Browser.edge;
			else if (DeviceInfo._isSamsung(useragentLocal)) browser = Browser.samsung;
			else if (DeviceInfo._isYandex(useragentLocal)) browser = Browser.yandex;
			else if (DeviceInfo._isMiui(useragentLocal)) browser = Browser.miui;
			//this way we are sure,that even though the UserAgent has chrome, it's not one of the previous browsers.
			else if (DeviceInfo._isChrome(useragentLocal)) browser = Browser.chrome;
			else if (DeviceInfo._isFirefox(useragentLocal)) browser = Browser.firefox;
			else if (DeviceInfo._isIE(useragentLocal)) browser = Browser.ie;
			else if (DeviceInfo._isUC(useragentLocal)) browser = Browser.uc;

			return browser;
		}

		public static GetDeviceOrientation(): DeviceOrientation {
			let orientation = DeviceOrientation.unknown;

			if (Style.ContainsClass(document.body, DeviceOrientation.landscape))
				orientation = DeviceOrientation.landscape;
			else if (Style.ContainsClass(document.body, DeviceOrientation.portrait))
				orientation = DeviceOrientation.portrait;

			return orientation;
		}

		public static GetDeviceType(): DeviceType {
			let device = DeviceType.desktop;

			if (Style.ContainsClass(document.body, DeviceType.phone)) device = DeviceType.phone;
			else if (Style.ContainsClass(document.body, DeviceType.tablet)) device = DeviceType.tablet;

			return device;
		}
	}
}
