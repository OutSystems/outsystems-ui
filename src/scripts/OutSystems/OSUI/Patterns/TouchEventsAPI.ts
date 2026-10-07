// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TouchEventsAPI {
	const _touchEventsMap = new Map<string, OSFramework.OSUI.Patterns.TouchEvents.ITouchEvents>(); //touchEvents.uniqueId -> TouchEvents obj

	/**
	 * Create the new TouchEvents instance and add it to the TouchEventssMap
	 *
	 * @param touchEventsId ID of the Pattern that a new instance will be created.
	 * @param configs Configurations for the Pattern in JSON format.
	 * @returns the TouchEvents instance
	 */
	export function Create(
		touchEventsId: string,
		configs: string | Configs
	): OSFramework.OSUI.Patterns.TouchEvents.ITouchEvents {
		if (_touchEventsMap.has(touchEventsId)) {
			throw new Error(
				`There is already an ${OSFramework.OSUI.GlobalEnum.PatternName.TouchEvents} registered under id: ${touchEventsId}`
			);
		}

		const _newTouchEvents = new OSFramework.OSUI.Patterns.TouchEvents.TouchEvents(
			touchEventsId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);

		_touchEventsMap.set(touchEventsId, _newTouchEvents);

		return _newTouchEvents;
	}

	/**
	 * Function that will dispose the instance of the given TouchEvents
	 *
	 * @param touchEventsId The id of the TouchEvents element
	 */
	export function Dispose(touchEventsId: string): void {
		const swipeEvent = GetTouchEventsById(touchEventsId);

		swipeEvent.dispose();

		_touchEventsMap.delete(swipeEvent.uniqueId);
	}

	/**
	 * Function that will return the Map with all the TouchEvents instances at the page
	 *
	 * @returns the ids of every TouchEvents instance
	 */
	export function GetAllTouchEvents(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_touchEventsMap);
	}

	/**
	 * Function that gets the instance of TouchEvents, by a given ID.
	 *
	 * @param touchEventsId ID of the TouchEvents that will be looked for.
	 * @returns the TouchEvents instance
	 */
	export function GetTouchEventsById(touchEventsId: string): OSFramework.OSUI.Patterns.TouchEvents.ITouchEvents {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'TouchEvents',
			touchEventsId,
			_touchEventsMap
		) as OSFramework.OSUI.Patterns.TouchEvents.ITouchEvents;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param touchEventsId ID of the TouchEvents that will be initialized.
	 * @returns the TouchEvents instance
	 */
	export function Initialize(touchEventsId: string): OSFramework.OSUI.Patterns.TouchEvents.ITouchEvents {
		const TouchEvents = GetTouchEventsById(touchEventsId);

		TouchEvents.build();

		return TouchEvents;
	}

	/**
	 * Function to register a callback
	 *
	 * @param touchEventsID The id of the TouchEvents element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 */
	export function RegisterCallback(
		touchEventsID: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): void {
		const touchEvents = this.GetTouchEventsById(touchEventsID);

		touchEvents.registerCallback(eventName, callback);
	}

	/**
	 * Function that will change the property of a given TouchEvents pattern.
	 *
	 * @param touchEventsId ID of the TouchEvents where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns Response object as a JSON string
	 */
	export function ChangeProperty(touchEventsId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TouchEvents.FailChangeProperty,
			callback: () => {
				const pattern = GetTouchEventsById(touchEventsId);

				pattern.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}
}
