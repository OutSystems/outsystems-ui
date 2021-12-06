// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TouchEventsAPI {
	const _touchEventsMap = new Map<string, OSUIFramework.Patterns.TouchEvents.ITouchEvents>(); //touchEvents.uniqueId -> TouchEvents obj

	/**
	 * Create the new TouchEvents instance and add it to the TouchEventssMap
	 *
	 * @export
	 * @param {string} touchEventsId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns TouchEvents. TouchEvents}
	 */
	export function Create(touchEventsId: string, configs: string): OSUIFramework.Patterns.TouchEvents.ITouchEvents {
		if (_touchEventsMap.has(touchEventsId)) {
			throw new Error(
				`There is already an ${OSUIFramework.GlobalEnum.PatternsNames.TouchEvents} registered under id: ${touchEventsId}`
			);
		}

		const _newTouchEvents = new OSUIFramework.Patterns.TouchEvents.TouchEvents(touchEventsId, JSON.parse(configs));

		_touchEventsMap.set(touchEventsId, _newTouchEvents);

		return _newTouchEvents;
	}

	/**
	 * Function that will dispose the instance of the given TouchEvents
	 *
	 * @export
	 * @param {string} touchEventsId
	 */
	export function Dispose(touchEventsId: string): void {
		const swipeEvent = GetTouchEventsById(touchEventsId);

		swipeEvent.dispose();

		_touchEventsMap.delete(swipeEvent.uniqueId);
	}

	/**
	 * Function that will return the Map with all the TouchEvents instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSUIFramework.Patterns TouchEvents.ITouchEvents>}
	 */
	export function GetAllTouchEvents(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_touchEventsMap);
	}

	/**
	 * Function that gets the instance of TouchEvents, by a given ID.
	 *
	 * @export
	 * @param {string} TouchEventsId ID of the TouchEvents that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns TouchEvents. TouchEvents;}
	 */
	export function GetTouchEventsById(touchEventsId: string): OSUIFramework.Patterns.TouchEvents.ITouchEvents {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			'TouchEvents',
			touchEventsId,
			_touchEventsMap
		) as OSUIFramework.Patterns.TouchEvents.ITouchEvents;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} touchEventsId ID of the TouchEvents that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns TouchEvents. TouchEvents}
	 */
	export function Initialize(touchEventsId: string): OSUIFramework.Patterns.TouchEvents.ITouchEvents {
		const TouchEvents = GetTouchEventsById(touchEventsId);

		TouchEvents.build();

		return TouchEvents;
	}

	/**
	 * Function to register a callback
	 *
	 * @export
	 * @param {string} touchEventsID
	 * @param {string} eventName
	 * @param {OSUIFramework.Callbacks.OSGeneric} callback
	 */
	export function RegisterCallback(
		touchEventsID: string,
		eventName: string,
		callback: OSUIFramework.Callbacks.OSGeneric
	): void {
		const touchEvents = this.GetTouchEventsById(touchEventsID);

		touchEvents.registerCallback(eventName, callback);
	}
}
