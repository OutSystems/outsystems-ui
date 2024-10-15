// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Helper {
	export abstract class Dates {
		/**
		 * Format of data as set in service center.
		 */
		private static _serverFormat = '';

		/**
		 * Function to be used in order to get the Time from a given Date
		 *
		 * @static
		 * @param {Date} _date
		 * @return {*}  {string}
		 * @memberof OSFramework.Helper.Dates
		 */
		public static GetTimeFromDate(_date: Date): string {
			// Get the Hour at the selected DateTime
			const _selectedHour = _date.getHours() < 10 ? '0' + _date.getHours() : _date.getHours();
			// Get the Minutes at the selected DateTime
			const _selectedMin = _date.getMinutes() < 10 ? '0' + _date.getMinutes() : _date.getMinutes();
			// Get the Secounds at the selected DateTime
			const _selectedSec = _date.getSeconds() < 10 ? '0' + _date.getSeconds() : _date.getSeconds();

			// return the string with a default time format
			return _selectedHour + ':' + _selectedMin + ':' + _selectedSec;
		}

		/**
		 * Function used to check if the given date1 is minor than given date2
		 *
		 * @static
		 * @param {string} date1 Date to be checked if minor
		 * @param {string} date2 Date to be checked if it's greater than date1
		 * @return {*}  {boolean}
		 * @memberof OSFramework.Helper.Dates
		 */
		public static IsBeforeThan(date1: string, date2: string): boolean {
			return Date.parse(date1) <= Date.parse(date2);
		}

		/**
		 * Function used to check if a given date is an OutSystems nullDate
		 *
		 * @export
		 * @param {string} date
		 * @memberof OSFramework.Helper.Dates
		 */
		public static IsNull(date: string | Date): boolean {
			let _date: Date;

			// Check if the given date is not a date object and if it's a valid date
			if (typeof date === 'string') {
				// Check if string could be parsed into a date - If it has an expected dateformat
				if (Number.isNaN(Date.parse(date))) {
					throw new Error(`The given date '${date}' it's not a valid date.`);
				}
				_date = new Date(Date.parse(date));
			} else if (date instanceof Date) {
				//we received a date
				_date = date;
			} else {
				//we received a undefined or anything else
				return true;
			}

			// Check if is an OutSystems Null date
			if (_date.getFullYear() === 1900 && _date.getMonth() === 0 && _date.getDate() === 1) {
				return true;
			}

			return false;
		}

		/**
		 * Function used to check if a date is valid
		 *
		 * @param {string} date
		 * @return {*}  {boolean}
		 * @memberof Dates
		 */
		public static IsValid(date: string): boolean {
			return !Number.isNaN(Number(this.NormalizeDate(date)));
		}

		/**
		 * Function used to normalize the OutSystems Dates
		 *
		 * @static
		 * @param {string} date
		 * @return {*}  {Date}
		 * @memberof Dates
		 */
		public static NormalizeDate(date: string): Date {
			// Store the current date
			let currDate: Date;

			// Check if the given date string is a ISO 8601 date format
			if (date.indexOf('T') > -1) {
				currDate = new Date(date);
			} else {
				// Dates are being sent from platform with '-' instead of '/'
				currDate = new Date(date.replace(/-/g, '/'));
			}

			return currDate;
		}

		/**
		 * Function used to normalize the OutSystems DateTimes, used on scopes expecting a Date
		 *
		 * @static
		 * @param {(string | Date)} date
		 * @param {boolean} [normalizeToMax=true]
		 * @return {*}  {Date}
		 * @memberof Dates
		 */
		public static NormalizeDateTime(date: string | Date, normalizeToMax): Date {
			let _newDate = date;

			if (typeof _newDate === 'string') {
				_newDate = new Date(date);
			}

			if (normalizeToMax) {
				// To make sure that if time is not being used, the hours are as high as possible, to not interfer with other date comparisons
				_newDate.setHours(23, 59, 59, 59);
			} else {
				// To make sure that if time is not being used, the hours are as low as possible, to not interfer with other date comparisons
				_newDate.setHours(0, 0, 0, 0);
			}

			return _newDate;
		}

		/**
		 * Function responsible for setting up the the server date format.
		 *
		 * @export
		 * @param {string} date example of date.
		 * @memberof OSFramework.Helper.Dates
		 */
		public static SetServerDateFormat(date: string): void {
			Dates._serverFormat = date.replace('13', 'DD').replace('10', 'MM').replace('1900', 'YYYY');
		}

		/**
		 * Getter that allows to obtain the Server DateFormat
		 *
		 * @readonly
		 * @static
		 * @type {string}
		 * @memberof OSFramework.Helper.Dates
		 */
		public static get ServerFormat(): string {
			return Dates._serverFormat;
		}
	}
}
