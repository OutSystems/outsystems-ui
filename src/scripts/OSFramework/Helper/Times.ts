// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Helper {
	export abstract class Times {
		/**
		 * Function used to check if a given time is an OutSystems nullDate
		 *
		 * @export
		 * @param {string} time
		 */
		public static IsNull(time: string): boolean {
			if (isNaN(Date.parse(time))) {
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
