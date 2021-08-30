// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 *
	 *
	 * @export
	 * @return {*}  {boolean}
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function GetIsRTL(): boolean {
		const isRTL = OSUIFramework.Helper.Style.ContainsClass(document.body, OSUIFramework.Constants.IsRTLClass);
		return isRTL;
	}
}
