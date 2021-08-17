/**
 * Namespace for all public methods to access and use the OutSystemsUI components.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
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

	enum BrowserName {
		chrome = 'chrome',
		edge = 'edge',
		firefox = 'firefox',
		internetexplorer = 'ie',
		kindle = 'kindle',
		miuibrowser = 'miuibrowser',
		opera = 'opera',
		safari = 'safari',
		samsungbrowser = 'samsungbrowser',
		ucbrowser = 'ucbrowser',
		yandex = 'yabrowser',
	}

	/**
	 * Function that identifies the browser being used
	 *
	 * @export
	 * @param {string} [useragent]
	 * @return {*}  {string}
	 */
	export function GetBrowser(useragent = ''): string {
		const useragentLocal =
			useragent.replace(' ', '') === '' ? window.navigator.userAgent.toLowerCase() : useragent.toLowerCase();
		if (CheckIsChrome(useragentLocal)) {
			return BrowserName.chrome;
		} else if (CheckIsEdge(useragentLocal)) {
			return BrowserName.edge;
		} else if (CheckIsFirefox(useragentLocal)) {
			return BrowserName.firefox;
		} else if (CheckIsSafari(useragentLocal)) {
			return BrowserName.safari;
		} else if (CheckIsOpera(useragentLocal)) {
			return BrowserName.opera;
		} else if (CheckIsInternetExplorer(useragentLocal)) {
			return BrowserName.internetexplorer;
		} else if (CheckIsKindle(useragentLocal)) {
			return BrowserName.kindle;
		} else if (CheckIsSamsungBrowser(useragentLocal)) {
			return BrowserName.samsungbrowser;
		} else if (CheckIsYandex(useragentLocal)) {
			return BrowserName.yandex;
		} else if (CheckIsMIUIBrowser(useragentLocal)) {
			return BrowserName.miuibrowser;
		} else if (CheckIsUCBrowser(useragentLocal)) {
			return BrowserName.ucbrowser;
		} else {
			return '';
		}
	}

	/**
	 * Function to check if the browser is Chrome based on the user agent string
	 *
	 * @param {string} useragent
	 * @return {*}  {boolean}
	 */
	function CheckIsChrome(useragent: string): boolean {
		return (
			(useragent.indexOf(UAKeyword.chrome) > -1 || useragent.indexOf(UAKeyword.crios) > -1) &&
			useragent.indexOf(UAKeyword.kindle) === -1 &&
			useragent.indexOf(UAKeyword.silk) === -1 &&
			useragent.indexOf(UAKeyword.kftt) === -1 &&
			useragent.indexOf(UAKeyword.kfot) === -1 &&
			useragent.indexOf(UAKeyword.kfjwa) === -1 &&
			useragent.indexOf(UAKeyword.kfjwi) === -1 &&
			useragent.indexOf(UAKeyword.kfsowi) === -1 &&
			useragent.indexOf(UAKeyword.kfthwa) === -1 &&
			useragent.indexOf(UAKeyword.kfthwi) === -1 &&
			useragent.indexOf(UAKeyword.kfapwa) === -1 &&
			useragent.indexOf(UAKeyword.kfapwi) === -1 &&
			useragent.indexOf(UAKeyword.opr) === -1 &&
			useragent.indexOf(UAKeyword.opera) === -1 &&
			useragent.indexOf(UAKeyword.opios) === -1 &&
			useragent.indexOf(UAKeyword.edge) === -1 &&
			useragent.indexOf(UAKeyword.edgios) === -1 &&
			useragent.indexOf(UAKeyword.edga) === -1 &&
			useragent.indexOf(UAKeyword.edg) === -1 &&
			useragent.indexOf(UAKeyword.samsungbrowser) === -1 &&
			useragent.indexOf(UAKeyword.yabrowser) === -1 &&
			useragent.indexOf(UAKeyword.miuibrowser) === -1
		);
	}

	/**
	 * Function to check if the browser is Edge based on the user agent string
	 *
	 * @param {string} useragent
	 * @return {*}  {boolean}
	 */
	function CheckIsEdge(useragent: string): boolean {
		return (
			useragent.indexOf(UAKeyword.edge) > -1 ||
			useragent.indexOf(UAKeyword.edgios) > -1 ||
			useragent.indexOf(UAKeyword.edga) > -1 ||
			useragent.indexOf(UAKeyword.edg) > -1
		);
	}

	/**
	 * Function to check if the browser is Firefox based on the user agent string
	 *
	 * @param {string} useragent
	 * @return {*}  {boolean}
	 */
	function CheckIsFirefox(useragent: string): boolean {
		return useragent.indexOf(UAKeyword.firefox) > -1 || useragent.indexOf(UAKeyword.fxios) > -1;
	}

	/**
	 * Function to check if the browser is Safari based on the user agent string
	 *
	 * @param {string} useragent
	 * @return {*}  {boolean}
	 */
	function CheckIsSafari(useragent: string): boolean {
		return (
			useragent.indexOf(UAKeyword.safari) > -1 &&
			useragent.indexOf(UAKeyword.chrome) === -1 &&
			useragent.indexOf(UAKeyword.opr) === -1 &&
			useragent.indexOf(UAKeyword.opera) === -1 &&
			useragent.indexOf(UAKeyword.opios) === -1 &&
			useragent.indexOf(UAKeyword.kindle) === -1 &&
			useragent.indexOf(UAKeyword.silk) === -1 &&
			useragent.indexOf(UAKeyword.kftt) === -1 &&
			useragent.indexOf(UAKeyword.kfot) === -1 &&
			useragent.indexOf(UAKeyword.kfjwa) === -1 &&
			useragent.indexOf(UAKeyword.kfjwi) === -1 &&
			useragent.indexOf(UAKeyword.kfsowi) === -1 &&
			useragent.indexOf(UAKeyword.kfthwa) === -1 &&
			useragent.indexOf(UAKeyword.kfthwi) === -1 &&
			useragent.indexOf(UAKeyword.kfapwa) === -1 &&
			useragent.indexOf(UAKeyword.kfapwi) === -1 &&
			useragent.indexOf(UAKeyword.ucbrowser) === -1
		);
	}

	/**
	 * Function to check if the browser is Opera based on the user agent string
	 *
	 * @param {string} useragent
	 * @return {*}  {boolean}
	 */
	function CheckIsOpera(useragent: string): boolean {
		return (
			useragent.indexOf(UAKeyword.opr) > -1 ||
			useragent.indexOf(UAKeyword.opera) > -1 ||
			useragent.indexOf(UAKeyword.opios) > -1
		);
	}

	/**
	 * Function to check if the browser is Internet Explorer based on the user agent string
	 *
	 * @param {string} useragent
	 * @return {*}  {boolean}
	 */
	function CheckIsInternetExplorer(useragent: string): boolean {
		return useragent.indexOf(UAKeyword.trident) > -1 || useragent.indexOf(UAKeyword.msie) > -1;
	}

	/**
	 * Function to check if the browser is Kindle based on the user agent string
	 *
	 * @param {string} useragent
	 * @return {*}  {boolean}
	 */
	function CheckIsKindle(useragent: string): boolean {
		return (
			useragent.indexOf(UAKeyword.kindle) > -1 ||
			useragent.indexOf(UAKeyword.silk) > -1 ||
			useragent.indexOf(UAKeyword.kftt) > -1 ||
			useragent.indexOf(UAKeyword.kfot) > -1 ||
			useragent.indexOf(UAKeyword.kfjwa) > -1 ||
			useragent.indexOf(UAKeyword.kfjwi) > -1 ||
			useragent.indexOf(UAKeyword.kfsowi) > -1 ||
			useragent.indexOf(UAKeyword.kfthwa) > -1 ||
			useragent.indexOf(UAKeyword.kfthwi) > -1 ||
			useragent.indexOf(UAKeyword.kfapwa) > -1 ||
			useragent.indexOf(UAKeyword.kfapwi) > -1
		);
	}

	/**
	 * Function to check if the browser is Samsung Browser based on the user agent string
	 *
	 * @param {string} useragent
	 * @return {*}  {boolean}
	 */
	function CheckIsSamsungBrowser(useragent: string): boolean {
		return useragent.indexOf(UAKeyword.samsungbrowser) > -1;
	}

	/**
	 * Function to check if the browser is Yandex based on the user agent string
	 *
	 * @param {string} useragent
	 * @return {*}  {boolean}
	 */
	function CheckIsYandex(useragent: string): boolean {
		return useragent.indexOf(UAKeyword.yabrowser) > -1;
	}

	/**
	 * Function to check if the browser is MIUI Browser based on the user agent string
	 *
	 * @param {string} useragent
	 * @return {*}  {boolean}
	 */
	function CheckIsMIUIBrowser(useragent: string): boolean {
		return useragent.indexOf(UAKeyword.miuibrowser) > -1;
	}

	/**
	 * Function to check if the browser is UC Browser based on the user agent string
	 *
	 * @param {string} useragent
	 * @return {*}  {boolean}
	 */
	function CheckIsUCBrowser(useragent: string): boolean {
		return useragent.indexOf(UAKeyword.ucbrowser) > -1;
	}
}
