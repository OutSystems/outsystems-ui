// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.RatingAPI {
	const _ratingsMap = new Map<string, OSFramework.OSUI.Patterns.Rating.IRating>(); //rating.uniqueId -> Rating obj

	/**
	 * Function that will change the property of a given rating.
	 *
	 * @param ratingId ID of the Rating where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(ratingId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Rating.FailChangeProperty,
			callback: () => {
				const rating = GetRatingById(ratingId);

				rating.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new rating instance and add it to the ratingsMap
	 *
	 * @param ratingId ID of the Rating where the instance will be created.
	 * @param configs configurations for the Rating in JSON format.
	 * @returns the Rating instance
	 */
	export function Create(ratingId: string, configs: string | Configs): OSFramework.OSUI.Patterns.Rating.IRating {
		if (_ratingsMap.has(ratingId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Rating} registered under id: ${ratingId}`
			);
		}

		const _newRating = new OSFramework.OSUI.Patterns.Rating.Rating(
			ratingId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);
		_ratingsMap.set(ratingId, _newRating);
		return _newRating;
	}

	/**
	 * Function that will set Rating with given ID as disabled
	 *
	 * @param ratingId The id of the Rating element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Disable(ratingId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Rating.FailDisable,
			callback: () => {
				const rating = GetRatingById(ratingId);

				rating.disable();
			},
		});

		return result;
	}

	/**
	 * Function that will dispose the instance of the given Rating
	 *
	 * @param ratingId ID of the Rating pattern.
	 * @returns Response object as a JSON string
	 */
	export function Dispose(ratingId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Rating.FailDispose,
			callback: () => {
				const rating = GetRatingById(ratingId);

				rating.dispose();

				_ratingsMap.delete(ratingId);
			},
		});

		return result;
	}

	/**
	 * Function that will set Rating with given ID as enabled
	 *
	 * @param ratingId The id of the Rating element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Enable(ratingId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Rating.FailEnable,
			callback: () => {
				const rating = GetRatingById(ratingId);

				rating.enable();
			},
		});

		return result;
	}

	/**
	 * Function that will return the Map with all the Rating instances at the page
	 *
	 * @returns the ids of every Rating instance
	 */
	export function GetAllRatings(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_ratingsMap);
	}

	/**
	 * Function that gets the instance of rating, by a given ID.
	 *
	 * @param ratingId ID of the Rating that will be looked for.
	 * @returns the Rating instance
	 */
	export function GetRatingById(ratingId: string): OSFramework.OSUI.Patterns.Rating.IRating {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'Rating',
			ratingId,
			_ratingsMap
		) as OSFramework.OSUI.Patterns.Rating.IRating;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param ratingId ID of the Rating that will be initialized.
	 * @returns the Rating instance
	 */
	export function Initialize(ratingId: string): OSFramework.OSUI.Patterns.Rating.IRating {
		const rating = GetRatingById(ratingId);

		rating.build();

		return rating;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @param ratingId The id of the Rating element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		ratingId: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Rating.FailRegisterCallback,
			callback: () => {
				const rating = GetRatingById(ratingId);

				rating.registerCallback(eventName, callback);
			},
		});

		return result;
	}
}
