// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SwipeEventsAPI {
	const _swipeEventsMap = new Map<string, OSFramework.OSUI.Patterns.SwipeEvents.ISwipeEvents>(); //swipeEvents.uniqueId -> SwipeEvents obj

	/**
	 * Create the new SwipeEvents instance and add it to the SwipeEventssMap
	 *
	 * @param swipeEventsId ID of the Pattern that a new instance will be created.
	 * @param configs Configurations for the Pattern in JSON format.
	 * @returns the SwipeEvents instance
	 */
	export function Create(
		swipeEventsId: string,
		configs: string | Configs
	): OSFramework.OSUI.Patterns.SwipeEvents.ISwipeEvents {
		if (_swipeEventsMap.has(swipeEventsId)) {
			throw new Error(
				`There is already an ${OSFramework.OSUI.GlobalEnum.PatternName.SwipeEvents} registered under id: ${swipeEventsId}`
			);
		}

		const _newSwipeEvents = new OSFramework.OSUI.Patterns.SwipeEvents.SwipeEvents(
			swipeEventsId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);

		_swipeEventsMap.set(swipeEventsId, _newSwipeEvents);

		return _newSwipeEvents;
	}

	/**
	 * Function that will dispose the instance of the given SwipeEvents
	 *
	 * @param swipeEventsId
	 */
	export function Dispose(swipeEventsId: string): void {
		const swipeEvent = GetSwipeEventsById(swipeEventsId);

		swipeEvent.dispose();

		_swipeEventsMap.delete(swipeEvent.uniqueId);
	}

	/**
	 * Function that will return the Map with all the SwipeEvents instances at the page
	 *
	 * @returns the ids of every SwipeEvents instance
	 */
	export function GetAllSwipeEvents(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_swipeEventsMap);
	}

	/**
	 * Function that gets the instance of SwipeEvents, by a given ID.
	 *
	 * @param swipeEventsId ID of the SwipeEvents that will be looked for.
	 * @returns the SwipeEvents instance
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
	 * @param swipeEventsId ID of the SwipeEvents that will be initialized.
	 * @returns the SwipeEvents instance
	 */
	export function Initialize(swipeEventsId: string): OSFramework.OSUI.Patterns.SwipeEvents.ISwipeEvents {
		const SwipeEvents = GetSwipeEventsById(swipeEventsId);

		SwipeEvents.build();

		return SwipeEvents;
	}

	/**
	 * Function to register a callback
	 *
	 * @param swipeEventsID
	 * @param eventName
	 * @param callback
	 */
	export function RegisterCallback(
		swipeEventsID: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): void {
		const swipeEvents = this.GetSwipeEventsById(swipeEventsID);

		swipeEvents.registerCallback(eventName, callback);
	}

	/**
	 * Function that will detect the event type of the pattern instance.
	 *
	 * @param swipeEventsId ID of the SwipeEvents pattern.
	 * @param event Touch event forwarded from the platform gesture handler.
	 */
	export function GestureMove(swipeEventsId: string, event: TouchEvent): void {
		const SwipeEvents = GetSwipeEventsById(swipeEventsId);

		SwipeEvents.EventGestureMove(event);
	}

	/**
	 * Function that will detect the event type of the pattern instance.
	 *
	 * @param swipeEventsId ID of the SwipeEvents pattern.
	 * @param offsetX Horizontal distance travelled by the gesture, in pixels.
	 * @param offsetY Vertical distance travelled by the gesture, in pixels.
	 * @param timeTaken Duration of the gesture, in milliseconds.
	 */
	export function GestureEnd(swipeEventsId: string, offsetX: number, offsetY: number, timeTaken: number): void {
		const SwipeEvents = GetSwipeEventsById(swipeEventsId);

		SwipeEvents.EventGestureEnd(offsetX, offsetY, timeTaken);
	}

	/**
	 * Function that will change the property of a given SwipeEvents pattern.
	 *
	 * @param swipeEventsId ID of the SwipeEvents where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns Response object as a JSON string
	 */
	export function ChangeProperty(swipeEventsId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.SwipeEvents.FailChangeProperty,
			callback: () => {
				const pattern = GetSwipeEventsById(swipeEventsId);

				pattern.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}
}
