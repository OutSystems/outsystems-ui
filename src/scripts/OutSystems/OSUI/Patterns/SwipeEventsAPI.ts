// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SwipeEventsAPI {
	const _swipeEventsMap = new Map<string, OSFramework.OSUI.Patterns.SwipeEvents.ISwipeEvents>(); //swipeEvents.uniqueId -> SwipeEvents obj

	/**
	 * Create the new SwipeEvents instance and add it to the SwipeEventssMap
	 *
	 * @export
	 * @param {string} swipeEventsId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns SwipeEvents. SwipeEvents}
	 */
	export function Create(swipeEventsId: string, configs: string): OSFramework.OSUI.Patterns.SwipeEvents.ISwipeEvents {
		if (_swipeEventsMap.has(swipeEventsId)) {
			throw new Error(
				`There is already an ${OSFramework.OSUI.GlobalEnum.PatternName.SwipeEvents} registered under id: ${swipeEventsId}`
			);
		}

		const _newSwipeEvents = OutSystems.OSUI.Patterns.PatternFactoryAPI.CreateInstance(
			OSFramework.OSUI.GlobalEnum.PatternName.SwipeEvents,
			swipeEventsId,
			JSON.parse(configs)
		) as OSFramework.OSUI.Patterns.SwipeEvents.ISwipeEvents;

		_swipeEventsMap.set(swipeEventsId, _newSwipeEvents);

		return _newSwipeEvents;
	}

	/**
	 * Function that will dispose the instance of the given SwipeEvents
	 *
	 * @export
	 * @param {string} swipeEventsId
	 */
	export function Dispose(swipeEventsId: string): void {
		const swipeEvent = GetSwipeEventsById(swipeEventsId);

		swipeEvent.dispose();

		_swipeEventsMap.delete(swipeEvent.uniqueId);
	}

	/**
	 * Function that will return the Map with all the SwipeEvents instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSFramework.OSUI.Patterns SwipeEvents.ISwipeEvents>}
	 */
	export function GetAllSwipeEvents(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_swipeEventsMap);
	}

	/**
	 * Function that gets the instance of SwipeEvents, by a given ID.
	 *
	 * @export
	 * @param {string} SwipeEventsId ID of the SwipeEvents that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns SwipeEvents. SwipeEvents;}
	 */
	export function GetSwipeEventsById(swipeEventsId: string): OSFramework.OSUI.Patterns.SwipeEvents.ISwipeEvents {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'SwipeEvents',
			swipeEventsId,
			_swipeEventsMap
		) as OSFramework.OSUI.Patterns.SwipeEvents.ISwipeEvents;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} swipeEventsId ID of the SwipeEvents that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns SwipeEvents. SwipeEvents}
	 */
	export function Initialize(swipeEventsId: string): OSFramework.OSUI.Patterns.SwipeEvents.ISwipeEvents {
		const SwipeEvents = GetSwipeEventsById(swipeEventsId);

		SwipeEvents.build();

		return SwipeEvents;
	}

	/**
	 * Function to register a callback
	 *
	 * @export
	 * @param {string} swipeEventsID
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 */
	export function RegisterCallback(
		swipeEventsID: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): void {
		const swipeEvents = this.GetSwipeEventsById(swipeEventsID);

		swipeEvents.registerCallback(eventName, callback);
	}

	/**
	 * Function that will detect the event type of the pattern instance.
	 *
	 * @export
	 * @param {string} swipeEventsId ID of the SwipeEvents that will be initialized.
	 */
	export function GestureMove(swipeEventsId: string, event: TouchEvent): void {
		const SwipeEvents = GetSwipeEventsById(swipeEventsId);

		SwipeEvents.EventGestureMove(event);
	}

	/**
	 * Function that will detect the event type of the pattern instance.
	 *
	 * @export
	 * @param {string} swipeEventsId ID of the SwipeEvents that will be initialized.
	 */
	export function GestureEnd(swipeEventsId: string, offsetX: number, offsetY: number, timeTaken: number): void {
		const SwipeEvents = GetSwipeEventsById(swipeEventsId);

		SwipeEvents.EventGestureEnd(offsetX, offsetY, timeTaken);
	}
}
