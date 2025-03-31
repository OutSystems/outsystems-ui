// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	// Set APIHandler type structure
	type APIHandler = {
		callback: OSFramework.OSUI.GlobalCallbacks.Generic;
		errorCode: string;
		hasValue?: boolean;
	};

	// Set APIResponse type structure
	type APIResponse = {
		code: string;
		isSuccess: boolean;
		message: string;
		// eslint-disable-next-line
		value?: unknown;
	};

	/**
	 * Method that will set the ApiResponse structure
	 * - callback: the logic to run and ensure there is no error on it, otherwise, catch that error message
	 * - errorCode: the error code to show when the given callback didn't perform
	 * - hasValue: if the callback code will return a value
	 *
	 * @param APIHandler { callback, errorCode, hasValue = false }
	 * @returns
	 */
	export function CreateApiResponse({ callback, errorCode, hasValue = false }: APIHandler): string {
		// Create the response object, by default as a Success one
		const responseObj: APIResponse = {
			code: OutSystems.OSUI.ErrorCodes.Success.code,
			isSuccess: true,
			message: OutSystems.OSUI.ErrorCodes.Success.message,
		};

		// Run the callback
		try {
			if (hasValue) {
				// Assign the callback returned value to the response.value
				responseObj.value = callback();
			} else {
				callback();
			}
		} catch (error) {
			// Update the response object if, for some reason we got an error on handling it
			responseObj.code = errorCode;
			responseObj.isSuccess = false;
			responseObj.message = error.message;
		}

		// Return the response as a JSON string, since it will be captured by the platform as a structure
		return JSON.stringify(responseObj);
	}
}
