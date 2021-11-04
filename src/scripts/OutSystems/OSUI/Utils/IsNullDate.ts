// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * Function used to check if a given date is an OutSystems nullDate
	 *
	 * @export
	 * @param {string} date
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function IsNullDate(date: string): boolean {
		const _date = date.indexOf('T') === -1 ? new Date(date.replace(/-/g, '/')) : new Date(date);

		if (_date.getFullYear() === 1900 && _date.getMonth() === 0 && _date.getDate() === 1) {
			return true;
		}

		return false;
	}
}
