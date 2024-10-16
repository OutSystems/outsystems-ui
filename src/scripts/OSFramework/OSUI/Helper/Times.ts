// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Helper {
	export abstract class Times {
		/**
		 * Function used to convert a time in seconds
		 *
		 * @static
		 * @param {string} time
		 * @return {*}  {number}
		 * @memberof Times
		 */
		public static ConvertInSeconds(time: Date): number {
			// Convert the time provided into seconds
			return (
				// To get the total seconds of hours and minutes, the hour needs to be multiplied for the number of minutes
				// and the minutes needs to multiply for the number of seconds
				time.getHours() * GlobalEnum.Time.HourInSeconds +
				time.getMinutes() * GlobalEnum.Time.MinuteInSeconds +
				time.getSeconds()
			);
		}

		/**
		 * Function used to check if a given time is an OutSystems nullDate
		 *
		 * @export
		 * @param {string} time
		 * @memberof OSFramework.Helper.Times
		 */
		public static IsNull(time: string): boolean {
			if (Number.isNaN(Date.parse(time))) {
				// Check if the given time is not a time object and if it's a valid time
				if (typeof time === Constants.JavaScriptTypes.String) {
					const isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(time);
					// Check if string could be parsed into a time - If it has an expected timeformat
					if (isValid === false) {
						throw new Error(`The given time '${time}' it's not a valid time.`);
					}
				} else {
					//we received a undefined or anything else
					return true;
				}
			} else {
				const auxDate = new Date(Date.parse(time));
				time = auxDate.getHours() + ':' + auxDate.getMinutes() + ':' + auxDate.getSeconds();
			}

			// Check if is an OutSystems Null time
			if (time === GlobalEnum.NullValues.Time) {
				return true;
			}

			return false;
		}
	}
}
