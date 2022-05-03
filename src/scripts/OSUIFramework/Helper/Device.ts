// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	/**
	 * Keywords to identify the browsers.
	 *
	 * @enum {number}
	 */
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

	/**
	 * Keywords to identify operating systems.
	 *
	 * @enum {number}
	 */
	enum OperatingSystemKeyword {
		Android = 'android',
		Ipad = 'ipad',
		Iphone = 'iphone',
		MacOS = 'mac',
		Windows = 'windows',
	}

	/** @type {iphoneDetails} type that identifies a iPhoneX/iPhone12/iPhone13 */
	type iphoneDetails = {
		description: string;
		height: number;
		width: number;
	};

	/** @type {iphoneDetails[]} has the widths and heights of each one of the devices. */
	const iphoneDevices: iphoneDetails[] = [
		// iPhoneX
		{ width: 1125, height: 2436, description: 'iphone x/xs' },
		{ width: 828, height: 1792, description: 'iphone xr' },
		{ width: 750, height: 1624, description: 'iphone xr scaled' },
		{ width: 1242, height: 2688, description: 'iphone xs max' },

		// iPhone12
		{ width: 1170, height: 2532, description: 'iphone 12' },
		{ width: 1284, height: 2778, description: 'iphone 12 pro max' },

		// iPhone13
		{ width: 1170, height: 2532, description: 'iphone 13' },
		{ width: 1125, height: 2436, description: 'iphone 13 mini' },
		{ width: 1170, height: 2532, description: 'iphone 13 pro' },
		{ width: 1284, height: 2778, description: 'iphone 13 pro max' },
	];

	export abstract class DeviceInfo {
		/******************** PRIVATE CACHE VARIABLES ********************/
		private static _browser = GlobalEnum.Browser.unknown;
		private static _iphoneDetails: iphoneDetails = undefined;
		private static _isAndroid: boolean | undefined = undefined;
		private static _isIos: boolean | undefined = undefined;
		private static _isIphoneWithNotch: boolean | undefined = undefined;
		private static _isNativeApp: boolean | undefined = undefined;
		private static _isPwa: boolean | undefined = undefined;
		private static _isTouch: boolean | undefined = undefined;
		private static _operatingSystem = GlobalEnum.MobileOS.Unknown;

		/******************** PRIVATE METHODS ********************/
		/**
		 * Gets the operating system based on the user agent.
		 *
		 * @private
		 * @static
		 * @param {string} [userAgent='']
		 * @return {*}  {GlobalEnum.MobileOS}
		 * @memberof DeviceInfo
		 */
		private static _getOperatingSystem(userAgent = ''): GlobalEnum.MobileOS {
			const userAgentLocal = DeviceInfo._getUserAgent(userAgent);
			let localOs = GlobalEnum.MobileOS.Unknown;

			if (userAgentLocal.includes(OperatingSystemKeyword.Android)) {
				localOs = GlobalEnum.MobileOS.Android;
			} else if (userAgentLocal.includes(OperatingSystemKeyword.Windows)) {
				localOs = GlobalEnum.MobileOS.Windows;
			} else if (
				userAgentLocal.includes(OperatingSystemKeyword.Ipad) ||
				userAgentLocal.includes(OperatingSystemKeyword.Iphone)
			) {
				localOs = GlobalEnum.MobileOS.IOS;
			} else if (userAgentLocal.includes(OperatingSystemKeyword.MacOS)) {
				localOs = GlobalEnum.MobileOS.MacOS;
			}
			return localOs;
		}

		/**
		 * Cleans the userAgent passed by the developer, or returns the one from the window.
		 *
		 * @private
		 * @static
		 * @param {string} [userAgent='']
		 * @return {*}
		 * @memberof DeviceInfo
		 */
		private static _getUserAgent(userAgent = '') {
			return userAgent.replace(' ', '') === ''
				? window.navigator.userAgent.toLowerCase()
				: userAgent.toLowerCase();
		}

		/**
		 * Checks if it's running inside chrome browser.
		 *
		 * @private
		 * @static
		 * @param {string} ua
		 * @return {*}  {boolean}
		 * @memberof DeviceInfo
		 */
		private static _isChrome(ua: string): boolean {
			return ua.includes(UAKeyword.chrome) || ua.includes(UAKeyword.crios);
		}

		/**
		 * Checks if it's running inside Edge browser.
		 *
		 * @private
		 * @static
		 * @param {string} ua
		 * @return {*}  {boolean}
		 * @memberof DeviceInfo
		 */
		private static _isEdge(ua: string): boolean {
			return (
				ua.includes(UAKeyword.edge) ||
				ua.includes(UAKeyword.edgios) ||
				ua.includes(UAKeyword.edga) ||
				ua.includes(UAKeyword.edg)
			);
		}

		/**
		 * Checks if it's running inside Firefox browser.
		 *
		 * @private
		 * @static
		 * @param {string} ua
		 * @return {*}  {boolean}
		 * @memberof DeviceInfo
		 */
		private static _isFirefox(ua: string): boolean {
			return ua.includes(UAKeyword.firefox) || ua.includes(UAKeyword.fxios);
		}

		/**
		 * Checks if it's running inside IE browser.
		 *
		 * @private
		 * @static
		 * @param {string} ua
		 * @return {*}  {boolean}
		 * @memberof DeviceInfo
		 */
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private static _isIE(ua: string): boolean {
			return ua.includes(UAKeyword.trident) || ua.includes(UAKeyword.msie);
		}

		/**
		 * Checks if it's running inside Kindle browser.
		 *
		 * @private
		 * @static
		 * @param {string} ua
		 * @return {*}  {boolean}
		 * @memberof DeviceInfo
		 */
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

		/**
		 * Checks if it's running inside MIUI browser.
		 *
		 * @private
		 * @static
		 * @param {string} ua
		 * @return {*}  {boolean}
		 * @memberof DeviceInfo
		 */
		private static _isMiui(ua: string): boolean {
			return ua.includes(UAKeyword.miuibrowser);
		}

		/**
		 * Checks if it's running inside Opera browser.
		 *
		 * @private
		 * @static
		 * @param {string} ua
		 * @return {*}  {boolean}
		 * @memberof DeviceInfo
		 */
		private static _isOpera(ua: string): boolean {
			return ua.includes(UAKeyword.opr) || ua.includes(UAKeyword.opera) || ua.includes(UAKeyword.opios);
		}

		/**
		 * Checks if it's running inside Safari browser.
		 *
		 * @private
		 * @static
		 * @param {string} ua
		 * @return {*}  {boolean}
		 * @memberof DeviceInfo
		 */
		private static _isSafari(ua: string): boolean {
			return ua.includes(UAKeyword.safari);
		}

		/**
		 * Checks if it's running inside Samsung browser.
		 *
		 * @private
		 * @static
		 * @param {string} ua
		 * @return {*}  {boolean}
		 * @memberof DeviceInfo
		 */
		private static _isSamsung(ua: string): boolean {
			return ua.includes(UAKeyword.samsungbrowser);
		}

		/**
		 *  Checks if it's running inside UC browser.
		 *
		 * @private
		 * @static
		 * @param {string} ua
		 * @return {*}  {boolean}
		 * @memberof DeviceInfo
		 */
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private static _isUC(ua: string): boolean {
			return ua.includes(UAKeyword.ucbrowser);
		}

		/**
		 * Checks if it's running inside Yandex browser.
		 *
		 * @private
		 * @static
		 * @param {string} ua
		 * @return {*}  {boolean}
		 * @memberof DeviceInfo
		 */
		private static _isYandex(ua: string): boolean {
			return ua.includes(UAKeyword.yabrowser);
		}

		/******************** PUBLIC GETTERS ********************/

		public static get HasAccessibilityEnabled(): boolean {
			return Helper.Dom.ClassSelector(document.body, Constants.HasAccessibilityClass) !== undefined;
		}

		/**
		 * Getter that returns if the application is running in a desktop device.
		 *
		 * @readonly
		 * @static
		 * @type {boolean}
		 * @memberof DeviceInfo
		 */
		public static get IsDesktop(): boolean {
			return DeviceInfo.GetDeviceType() === GlobalEnum.DeviceType.desktop;
		}

		/**
		 * Getter that returns if the application is running in a phone device.
		 *
		 * @readonly
		 * @static
		 * @type {boolean}
		 * @memberof DeviceInfo
		 */
		public static get IsPhone(): boolean {
			return DeviceInfo.GetDeviceType() === GlobalEnum.DeviceType.phone;
		}

		/**
		 * Getter that retuns if the application is running in a iPhone with a notch (iphoneX/iphone12/iphone13).
		 *
		 * @readonly
		 * @static
		 * @type {boolean}
		 * @memberof DeviceInfo
		 */
		public static get IsIphoneWithNotch(): boolean {
			if (DeviceInfo._isIphoneWithNotch === undefined) {
				// get the device pixel ratio
				const ratio = window.devicePixelRatio || 1;
				const currScreen: iphoneDetails = {
					width: window.screen.width * ratio,
					height: window.screen.height * ratio,
					description: '',
				};

				DeviceInfo._iphoneDetails = iphoneDevices.find((device: iphoneDetails) => {
					return device.height === currScreen.height && device.width === currScreen.width;
				});

				DeviceInfo._isIphoneWithNotch = DeviceInfo._iphoneDetails !== undefined;
			}
			return DeviceInfo._isIphoneWithNotch;
		}

		/**
		 * Getter that returns if the application is running in a tablet device.
		 *
		 * @readonly
		 * @static
		 * @type {boolean}
		 * @memberof DeviceInfo
		 */
		public static get IsTablet(): boolean {
			return DeviceInfo.GetDeviceType() === GlobalEnum.DeviceType.tablet;
		}

		/**
		 * Getter that returns if the application is running as a PWA.
		 *
		 * @readonly
		 * @static
		 * @type {boolean}
		 * @memberof DeviceInfo
		 */
		public static get IsPwa(): boolean {
			if (DeviceInfo._isPwa === undefined) {
				DeviceInfo._isPwa =
					(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
					window.navigator.standalone === true;
			}
			return DeviceInfo._isPwa;
		}

		/**
		 * Getter that returns if the application is running inside a native shell.
		 *
		 * @readonly
		 * @static
		 * @type {boolean}
		 * @memberof DeviceInfo
		 */
		public static get IsNative(): boolean {
			if (DeviceInfo._isNativeApp === undefined) {
				DeviceInfo._isNativeApp = window.cordova !== undefined && !DeviceInfo.IsPwa;
			}
			return DeviceInfo._isNativeApp;
		}

		public static get IsAndroid(): boolean {
			if (DeviceInfo._isAndroid === undefined) {
				DeviceInfo._isAndroid = Dom.Styles.ContainsClass(document.body, GlobalEnum.MobileOS.Android);
			}
			return DeviceInfo._isAndroid;
		}

		public static get IsIos(): boolean {
			if (DeviceInfo._isIos === undefined) {
				DeviceInfo._isIos = Dom.Styles.ContainsClass(document.body, GlobalEnum.MobileOS.IOS);
			}
			return DeviceInfo._isIos;
		}

		/**
		 * Getter that returns if the device is touched enabled or not.
		 *
		 * @readonly
		 * @static
		 * @type {boolean}
		 * @memberof DeviceInfo
		 */
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

		/******************** PUBLIC METHODS ********************/

		/**
		 * Gets in which browser the framework is running, based in the UserAgent information.
		 *
		 * @static
		 * @param {string} [userAgent=''] Optional parameter. If none is passed, the framework will get it.
		 * @return {*}  {GlobalEnum.Browser}
		 * @memberof DeviceInfo
		 */
		public static GetBrowser(userAgent = ''): GlobalEnum.Browser {
			let browser = GlobalEnum.Browser.unknown;

			//if the developer did pass an user agent, let's not use our cached value.
			if (userAgent.trim() !== '') {
				const userAgentLocal = DeviceInfo._getUserAgent(userAgent);
				//The order of the ifs should be kept until chrome
				if (DeviceInfo._isKindle(userAgentLocal)) browser = GlobalEnum.Browser.kindle;
				else if (DeviceInfo._isOpera(userAgentLocal)) browser = GlobalEnum.Browser.opera;
				else if (DeviceInfo._isEdge(userAgentLocal)) browser = GlobalEnum.Browser.edge;
				else if (DeviceInfo._isSamsung(userAgentLocal)) browser = GlobalEnum.Browser.samsung;
				else if (DeviceInfo._isYandex(userAgentLocal)) browser = GlobalEnum.Browser.yandex;
				else if (DeviceInfo._isMiui(userAgentLocal)) browser = GlobalEnum.Browser.miui;
				//this way we are sure,that even though the UserAgent has chrome, it's not one of the previous browsers.
				else if (DeviceInfo._isChrome(userAgentLocal)) browser = GlobalEnum.Browser.chrome;
				else if (DeviceInfo._isFirefox(userAgentLocal)) browser = GlobalEnum.Browser.firefox;
				else if (DeviceInfo._isSafari(userAgentLocal)) browser = GlobalEnum.Browser.safari;
				else if (DeviceInfo._isIE(userAgentLocal)) browser = GlobalEnum.Browser.ie;
				else if (DeviceInfo._isUC(userAgentLocal)) browser = GlobalEnum.Browser.uc;
			} else {
				//if no user agent was passed, and we don't have any value cached, let's call this same function recursively
				//but this time pass the actual user agent.
				if (DeviceInfo._browser === GlobalEnum.Browser.unknown) {
					//let's update the cached value.
					DeviceInfo._browser = DeviceInfo.GetBrowser(DeviceInfo._getUserAgent());
				}
				//let's update the value to be returned.
				browser = DeviceInfo._browser;
			}

			return browser;
		}

		/**
		 * Gets the orientation of the device, based on the class added by OutSystems platform in the body.
		 *
		 * @static
		 * @return {*}  {GlobalEnum.DeviceOrientation} Detected orientation of the device.
		 * @memberof DeviceInfo
		 */
		public static GetDeviceOrientation(): GlobalEnum.DeviceOrientation {
			let orientation = GlobalEnum.DeviceOrientation.unknown;
			if (Dom.Styles.ContainsClass(document.body, GlobalEnum.DeviceOrientation.landscape))
				orientation = GlobalEnum.DeviceOrientation.landscape;
			else if (Dom.Styles.ContainsClass(document.body, GlobalEnum.DeviceOrientation.portrait))
				orientation = GlobalEnum.DeviceOrientation.portrait;

			return orientation;
		}

		/**
		 * Gets the device in which the framework is running, based on the class added by the OutSystems platform in the body.
		 *
		 * @static
		 * @return {*}  {GlobalEnum.DeviceType} Detected device type.
		 * @memberof DeviceInfo
		 */
		public static GetDeviceType(): GlobalEnum.DeviceType {
			let device = GlobalEnum.DeviceType.desktop;

			if (Dom.Styles.ContainsClass(document.body, GlobalEnum.DeviceType.phone))
				device = GlobalEnum.DeviceType.phone;
			else if (Dom.Styles.ContainsClass(document.body, GlobalEnum.DeviceType.tablet))
				device = GlobalEnum.DeviceType.tablet;

			return device;
		}

		/**
		 * Obtains the Operating system in which the framework is running
		 *
		 * @static
		 * @param {string} [userAgent=''] Optional parameter. If none, the framework will obtain the UserAgent, calculate it once, and use the cache value afterwards.
		 * @return {*}  {GlobalEnum.MobileOS} Detected operating system.
		 * @memberof DeviceInfo
		 */
		public static GetOperatingSystem(userAgent = ''): GlobalEnum.MobileOS {
			let localOs = GlobalEnum.MobileOS.Unknown;

			//If the developer passed an UA, let's not use the cached value, but always calculate it. Useful
			if (userAgent.trim() !== '') {
				localOs = DeviceInfo._getOperatingSystem();
			} else {
				if (DeviceInfo._operatingSystem === GlobalEnum.MobileOS.Unknown) {
					DeviceInfo._operatingSystem = DeviceInfo.GetOperatingSystem(DeviceInfo._getUserAgent());
				}
				localOs = DeviceInfo._operatingSystem;
			}

			return localOs;
		}
	}
}
