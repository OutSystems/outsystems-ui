// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Dates {
	/**
	 * Method that will expose the ServerDateFormat.
	 *
	 * @export
	 * @return {*}  {string}  Server Date Format
	 */
	export function GetServerDateFormat(): string {
		return OSUIFramework.Helper.Dates.ServerFormat;
	}

	/**
	 * Used to trigger the OSUIFramework method responsible for set the ServerDateFormat
	 *
	 * @export
	 * @param {string} date A Sample Date that will be used to set the ServerDateFormat
	 */
	export function SetServerDateFormat(date: string): void {
		OSUIFramework.Helper.Dates.SetServerDateFormat(date);
	}
}
