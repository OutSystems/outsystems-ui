// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * Method that returns if the current screen is using RTL
	 *
	 * @export
	 * @return {*}  {boolean}
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function GetIsRTL(): boolean {
		return OSUIFramework.Helper.Style.ContainsClass(document.body, OSUIFramework.Constants.IsRTLClass);
	}
}
