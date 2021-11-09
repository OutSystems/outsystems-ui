// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper.Dates {
	/**
	 * Function used to check if a given date is an OutSystems nullDate
	 *
	 * @export
	 * @param {string} date
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function IsNull(date: string): boolean {
		// Check if the given date is a valid date
		if (isNaN(Date.parse(date))) {
			throw new Error(`The given date '${date}' it's not a valid date.`);
		} else if (Date.parse(date) < 0) {
			// 1st Jan 1970 is the actual Date baseline.
			return true;
		}

		const _date = new Date(Date.parse(date));

		// Check if is an OutSystems Null date
		if (_date.getFullYear() === 1900 && _date.getMonth() === 0 && _date.getDate() === 1) {
			return true;
		}

		return false;
	}
}
