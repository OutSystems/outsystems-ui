/**
 * Namespace for all public methods to access and use the OutSystemsUI components.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * Function that identifies the browser being used
	 *
	 * @param [useragent]
	 */
	export function GetBrowser(useragent = ''): string {
		return OSFramework.OSUI.Helper.DeviceInfo.GetBrowser(useragent);
	}
}
