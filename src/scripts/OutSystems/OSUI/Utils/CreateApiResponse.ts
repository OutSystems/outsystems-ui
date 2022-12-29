// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	type APIHandler = {
		// eslint-disable-next-line
		callback: any;
		errorCode: string;
		hasValue?: boolean;
	};

	type APIResponse = {
		code: string;
		isSuccess: boolean;
		message: string;
		// eslint-disable-next-line
		value?: any;
	};

	export function CreateApiResponse({ callback, errorCode, hasValue = false }: APIHandler): string {
		const responseObj: APIResponse = {
			isSuccess: true,
			message: OutSystems.OSUI.ErrorCodes.Success.message,
			code: OutSystems.OSUI.ErrorCodes.Success.code,
		};

		try {
			if (hasValue) {
				responseObj.value = callback();
			} else {
				callback();
			}
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = errorCode;
		}

		return JSON.stringify(responseObj);
	}
}
