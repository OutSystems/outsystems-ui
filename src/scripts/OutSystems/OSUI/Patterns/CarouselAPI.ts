// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.CarouselAPI {
	const _carouselItemsMap = new Map<string, OSFramework.OSUI.Patterns.Carousel.ICarousel>();

	/**
	 * Function that will enable updates on OnRender event
	 *
	 * @export
	 * @param {string} carouselId
	 * @return {*}  {string}
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
	 * @export
	 * @param {string} carouselId
	 * @return {*}  {string}
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
	 * @export
	 * @param {string} carouselId ID of the Carousel where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
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
	 * @export
	 * @param {string} carouselId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.Carousel.ICarousel}
	 */
	export function Create(
		carouselId: string,
		configs: string,
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
	 * @export
	 * @param {string} carouselId
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
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllCarouselItemsMap(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_carouselItemsMap);
	}

	/**
	 * Function that gets the instance of Carousel, by a given ID.
	 *
	 * @export
	 * @param {string} carouselId ID of the Carousel that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.Carousel.ICarousel;}
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
	 * @export
	 * @param {string} carouselId
	 * @param {number} index
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
	 * @export
	 * @param {string} carouselId ID of the CarouselItem that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.Carousel.ICarousel}
	 */
	export function Initialize(carouselId: string): OSFramework.OSUI.Patterns.Carousel.ICarousel {
		const _carouselItem = GetCarouselItemById(carouselId);

		_carouselItem.build();

		return _carouselItem;
	}

	/**
	 * Function to go to the next page
	 *
	 * @export
	 * @param {string} carouselId
	 * @param {string} target
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
	 * @export
	 * @param {string} carouselId
	 * @param {string} target
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
	 * @export
	 * @param {string} carouselId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 */
	export function RegisterCallback(
		carouselId: string,
		eventName: string,
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
	 * @export
	 * @param {string} carouselId
	 * @param {boolean} hasDrag
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
	 * @export
	 * @param {string} carouselId
	 * @return {*}  {OSFramework.OSUI.Patterns.Carousel.ICarousel}
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
	 * @export
	 * @param {string} carouselId
	 * @return {*}  {OSFramework.OSUI.Patterns.Carousel.ICarousel}
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
	 * @export
	 * @param {string} carouselId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.Generic} callback
	 * @return {*}  {string}
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
	 * @export
	 * @param {string} carouselId
	 * @param {string} eventId
	 * @return {*}  {string}
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
