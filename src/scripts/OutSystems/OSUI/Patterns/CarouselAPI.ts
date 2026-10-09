// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.CarouselAPI {
	const _carouselItemsMap = new Map<string, OSFramework.OSUI.Patterns.Carousel.ICarousel>();

	/**
	 * Function that will enable updates on OnRender event
	 *
	 * @param carouselId The id of the Carousel element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function CarouselEnableOnRender(carouselId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Carousel.FailEnableOnRender,
			callback: () => {
				const carousel = GetCarouselItemById(carouselId);
				carousel.toggleOnRender(false);
			},
		});

		return result;
	}

	/**
	 * Function that will disable updates on OnRender event
	 *
	 * @param carouselId The id of the Carousel element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function CarouselDisableOnRender(carouselId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Carousel.FailDisableOnRender,
			callback: () => {
				const carousel = GetCarouselItemById(carouselId);
				carousel.toggleOnRender(true);
			},
		});

		return result;
	}

	/**
	 * Function that will change the property of a given Carousel Id.
	 *
	 * @param carouselId ID of the Carousel where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(carouselId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Carousel.FailChangeProperty,
			callback: () => {
				const _carouselItem = GetCarouselItemById(carouselId);

				_carouselItem.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new CarouselItem instance and add it to the carouselItemsMap
	 *
	 * @param carouselId ID of the Pattern that a new instance will be created.
	 * @param configs Configurations for the Pattern in JSON format.
	 * @param provider Name of the provider that renders the carousel (Splide).
	 * @returns the Carousel instance
	 */
	export function Create(
		carouselId: string,
		configs: string | Configs,
		provider: string
	): OSFramework.OSUI.Patterns.Carousel.ICarousel {
		if (_carouselItemsMap.has(carouselId)) {
			throw new Error(
				`There is already an ${OSFramework.OSUI.GlobalEnum.PatternName.Carousel} registered under id: ${carouselId}`
			);
		}

		const _carouselItem = OSFramework.OSUI.Patterns.Carousel.Factory.NewCarousel(carouselId, configs, provider);

		_carouselItemsMap.set(carouselId, _carouselItem);

		return _carouselItem;
	}

	/**
	 * Function that will dispose the instance of the given CarouselItem Id
	 *
	 * @param carouselId The id of the Carousel element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Dispose(carouselId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Carousel.FailDispose,
			callback: () => {
				const _carouselItem = GetCarouselItemById(carouselId);

				_carouselItem.dispose();

				_carouselItemsMap.delete(_carouselItem.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the Carousel instances at the page
	 *
	 * @returns Array<string>
	 */
	export function GetAllCarouselItemsMap(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_carouselItemsMap);
	}

	/**
	 * Function that gets the instance of Carousel, by a given ID.
	 *
	 * @param carouselId ID of the Carousel that will be looked for.
	 * @returns the Carousel instance
	 */
	export function GetCarouselItemById(carouselId: string): OSFramework.OSUI.Patterns.Carousel.ICarousel {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'Carousel',
			carouselId,
			_carouselItemsMap
		) as OSFramework.OSUI.Patterns.Carousel.ICarousel;
	}

	/**
	 * Function to go to a especific page index
	 *
	 * @param carouselId The id of the Carousel element
	 * @param index The zero-based index of the item to go to
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function GoTo(carouselId: string, index: number): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Carousel.FailGoTo,
			callback: () => {
				const carousel = GetCarouselItemById(carouselId);

				carousel.goTo(index);
			},
		});

		return result;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param carouselId ID of the CarouselItem that will be initialized.
	 * @returns the Carousel instance
	 */
	export function Initialize(carouselId: string): OSFramework.OSUI.Patterns.Carousel.ICarousel {
		const _carouselItem = GetCarouselItemById(carouselId);

		_carouselItem.build();

		return _carouselItem;
	}

	/**
	 * Function to go to the next page
	 *
	 * @param carouselId The id of the Carousel element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Next(carouselId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Carousel.FailNext,
			callback: () => {
				const carousel = GetCarouselItemById(carouselId);

				carousel.next();
			},
		});

		return result;
	}

	/**
	 * Function to go to the previous page
	 *
	 * @param carouselId The id of the Carousel element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Previous(carouselId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Carousel.FailPrevious,
			callback: () => {
				const carousel = GetCarouselItemById(carouselId);

				carousel.previous();
			},
		});

		return result;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @param carouselId The id of the Carousel element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		carouselId: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Carousel.FailRegisterCallback,
			callback: () => {
				const carousel = GetCarouselItemById(carouselId);

				carousel.registerCallback(eventName, callback);
			},
		});

		return result;
	}

	/**
	 * Function to toggle the drag events on the Carousel
	 *
	 * @param carouselId The id of the Carousel element
	 * @param hasDrag Whether dragging is enabled
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ToggleDrag(carouselId: string, hasDrag: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Carousel.FailToggleDrag,
			callback: () => {
				const carousel = GetCarouselItemById(carouselId);

				carousel.toggleDrag(hasDrag);
			},
		});

		return result;
	}

	/**
	 * Function that will update on DOM changes inside the Carousel
	 *
	 * @param carouselId The id of the Carousel element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function UpdateOnRender(carouselId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Carousel.FailUpdate,
			callback: () => {
				const carousel = GetCarouselItemById(carouselId);

				carousel.updateOnRender();
			},
		});

		return result;
	}

	/**
	 * Function that will update the direction of the carousel
	 *
	 * @param carouselId ID of the Carousel pattern.
	 * @param direction Slide direction: ltr, rtl or ttb.
	 * @returns Response object as a JSON string
	 */
	export function SetCarouselDirection(carouselId: string, direction: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Carousel.FailDirection,
			callback: () => {
				const carousel = GetCarouselItemById(carouselId);

				carousel.setCarouselDirection(direction);
			},
		});

		return result;
	}

	/**
	 * Function to set provider configs by extensibility
	 *
	 * @param carouselId ID of the Carousel pattern.
	 * @param configs Provider (Splide) options to merge into the instance.
	 * @returns Response object as a JSON string
	 */
	export function SetProviderConfigs(carouselId: string, configs: CarouselProviderConfigs): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Carousel.FailRegisterProviderConfig,
			callback: () => {
				const carousel = GetCarouselItemById(carouselId);
				carousel.setProviderConfigs(configs);
			},
		});

		return result;
	}

	/**
	 * Function to set providerEvents by extensibility
	 *
	 * @param carouselId The id of the Carousel element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function SetProviderEvent(
		carouselId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.Generic
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Carousel.FailRegisterProviderEvent,
			hasValue: true,
			callback: () => {
				const _eventUniqueId = OSFramework.OSUI.Helper.Dom.GenerateUniqueId();

				const carousel = GetCarouselItemById(carouselId);
				carousel.setProviderEvent(eventName, callback, _eventUniqueId);
				return _eventUniqueId;
			},
		});

		return result;
	}

	/**
	 * Function to remove providerEvents added by extensibility
	 *
	 * @param carouselId The id of the Carousel element
	 * @param eventId The id of the provider event
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function UnsetProviderEvent(carouselId: string, eventId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Carousel.FailRemoveProviderEvent,
			callback: () => {
				const carousel = GetCarouselItemById(carouselId);
				carousel.unsetProviderEvent(eventId);
			},
		});

		return result;
	}
}
