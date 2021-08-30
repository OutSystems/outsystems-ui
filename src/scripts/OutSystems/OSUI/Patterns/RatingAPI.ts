// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.RatingAPI {
	const _ratingsMap = new Map<string, OSUIFramework.Patterns.Rating.IRating>(); //rating.uniqueId -> Rating obj

	/**
	 * Function that will change the property of a given rating.
	 *
	 * @export
	 * @param {string} ratingId ID of the Rating where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	export function ChangeProperty(ratingId: string, propertyName: string, propertyValue: any): void {
		const rating = GetRatingById(ratingId);
		rating.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Create the new rating instance and add it to the ratingsMap
	 *
	 * @export
	 * @param {string} ratingId ID of the Rating where the instance will be created.
	 * @param {string} configs configurations for the Rating in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.IRating}
	 */
	export function Create(ratingId: string, configs: string): OSUIFramework.Patterns.Rating.IRating {
		if (_ratingsMap.has(ratingId)) {
			throw new Error(`There is already a rating registered under id: ${ratingId}`);
		}

		const _newRating = new OSUIFramework.Patterns.Rating.Rating(ratingId, JSON.parse(configs));
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
	export function Destroy(ratingId: string): void {
		const rating = GetRatingById(ratingId);

		rating.dispose();

		_ratingsMap.delete(ratingId);
	}

	/**
	 * Function that will return the Map with all the Rating instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSUIFramework.Patterns.IRating>}
	 */
	export function GetAllRatings(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_ratingsMap);
	}

	/**
	 * Function that gets the instance of rating, by a given ID.
	 *
	 * @export
	 * @param {string} ratingId ID of the Rating that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.IRating}
	 */
	export function GetRatingById(ratingId: string): OSUIFramework.Patterns.Rating.IRating {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			'Rating',
			ratingId,
			_ratingsMap
		) as OSUIFramework.Patterns.Rating.IRating;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} ratingId ID of the Rating that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.IRating}
	 */
	export function Initialize(ratingId: string): OSUIFramework.Patterns.Rating.IRating {
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
	export function RegisterCallback(ratingId: string, callback: OSUIFramework.Callbacks.OSRatingSelectEvent): void {
		const rating = GetRatingById(ratingId);

		rating.registerCallback(callback);
	}
}
