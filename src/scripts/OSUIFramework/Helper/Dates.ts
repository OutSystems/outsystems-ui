// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	export abstract class Dates {
		/**
		 * Format of data as set in service center.
		 */
		private static _serverFormat = '';

		/**
		 * Function that will compare 2 dates and check if date1 is older than date2
		 *
		 * @static
		 * @param {string} date1 Date to be checked if older
		 * @param {string} date2 Date to be checked if it's after date1
		 * @return {*}  {boolean}
		 * @memberof Dates
		 */
		public static Compare(date1: string, date2: string): boolean {
			return Date.parse(date1) < Date.parse(date2);
		}

		public static get ServerFormat(): string {
			return Dates._serverFormat;
		}

		/**
		 * Function used to check if a given date is an OutSystems nullDate
		 *
		 * @export
		 * @param {string} date
		 */
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public static IsNull(date: string): boolean {
			// Check if the given date is a valid date
			if (isNaN(Date.parse(date.split(' ')[0]))) {
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

		/**
		 * Function responsible for setting up the the server date format.
		 *
		 * @export
		 * @param {string} date example of date.
		 */
		public static SetServerDateFormat(date: string): void {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			Dates._serverFormat = date.replace('13', 'DD').replace('10', 'MM').replace('1900', 'YYYY');
		}
	}
}
