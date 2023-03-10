// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.RatingAPI {
	const _ratingsMap = new Map<string, OSFramework.OSUI.Patterns.Rating.IRating>(); //rating.uniqueId -> Rating obj

	/**
	 * Function that will change the property of a given rating.
	 *
	 * @export
	 * @param {string} ratingId ID of the Rating where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	export function ChangeProperty(ratingId: string, propertyName: string, propertyValue: any): string {
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
	 * @export
	 * @param {string} ratingId ID of the Rating where the instance will be created.
	 * @param {string} configs configurations for the Rating in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.IRating}
	 */
	export function Create(ratingId: string, configs: string): OSFramework.OSUI.Patterns.Rating.IRating {
		if (_ratingsMap.has(ratingId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Rating} registered under id: ${ratingId}`
			);
		}

		const _newRating = OutSystems.OSUI.Patterns.PatternFactoryAPI.CreateInstance(
			OSFramework.OSUI.GlobalEnum.PatternName.Rating,
			ratingId,
			JSON.parse(configs)
		) as OSFramework.OSUI.Patterns.Rating.IRating;

		_ratingsMap.set(ratingId, _newRating);
		return _newRating;
	}

	/**
	 *
	 *
	 * @export
	 * @param {string} ratingId
	 * @return {*}  {*}
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
	 * Function that will return the Map with all the Rating instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSFramework.OSUI.Patterns.IRating>}
	 */
	export function GetAllRatings(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_ratingsMap);
	}

	/**
	 * Function that gets the instance of rating, by a given ID.
	 *
	 * @export
	 * @param {string} ratingId ID of the Rating that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.IRating}
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
	 * @export
	 * @param {string} ratingId ID of the Rating that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.IRating}
	 */
	export function Initialize(ratingId: string): OSFramework.OSUI.Patterns.Rating.IRating {
		const rating = GetRatingById(ratingId);

		rating.build();

		return rating;
	}

	/**
	 *
	 *
	 * @export
	 * @param {string} ratingId
	 * @param {*} callback
	 */
	export function RegisterCallback(
		ratingId: string,
		callback: OSFramework.OSUI.Patterns.Rating.Callbacks.OSOnSelectEvent
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Rating.FailRegisterCallback,
			callback: () => {
				const rating = GetRatingById(ratingId);

				rating.registerCallback(callback);
			},
		});

		return result;
	}
}
