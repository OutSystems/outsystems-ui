// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.CarouselAPI {
	const _carouselItemsMap = new Map<string, OSUIFramework.Patterns.Carousel.ICarousel>();

	/**
	 * Function that will change the property of a given Carousel Id.
	 *
	 * @export
	 * @param {string} carouselId ID of the Carousel where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(carouselId: string, propertyName: string, propertyValue: any): void {
		const _carouselItem = GetCarouselItemById(carouselId);

		_carouselItem.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Create the new CarouselItem instance and add it to the carouselItemsMap
	 *
	 * @export
	 * @param {string} carouselId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.Carousel.ICarousel}
	 */
	export function Create(
		carouselId: string,
		configs: string,
		provider: string
	): OSUIFramework.Patterns.Carousel.ICarousel {
		if (_carouselItemsMap.has(carouselId)) {
			throw new Error(
				`There is already an ${OSUIFramework.GlobalEnum.PatternsNames.Carousel} registered under id: ${carouselId}`
			);
		}

		const _carouselItem = OSUIFramework.Patterns.Carousel.Factory.NewCarousel(carouselId, configs, provider);

		_carouselItemsMap.set(carouselId, _carouselItem);

		return _carouselItem;
	}

	/**
	 * Function that will dispose the instance of the given CarouselItem Id
	 *
	 * @export
	 * @param {string} carouselId
	 */
	export function Dispose(carouselId: string): void {
		const _carouselItem = GetCarouselItemById(carouselId);

		_carouselItem.dispose();

		_carouselItemsMap.delete(_carouselItem.uniqueId);
	}

	/**
	 * Fucntion that will return the Map with all the Carousel instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllCarouselItemsMap(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_carouselItemsMap);
	}

	/**
	 * Function that gets the instance of Carousel, by a given ID.
	 *
	 * @export
	 * @param {string} carouselId ID of the Carousel that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.Carousel.ICarousel;}
	 */
	export function GetCarouselItemById(carouselId: string): OSUIFramework.Patterns.Carousel.ICarousel {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			'Carousel',
			carouselId,
			_carouselItemsMap
		) as OSUIFramework.Patterns.Carousel.ICarousel;
	}

	/**
	 * Function to go to a especific page index
	 *
	 * @export
	 * @param {string} carouselId
	 * @param {number} index
	 */
	export function GoTo(carouselId: string, index: number): void {
		const carousel = GetCarouselItemById(carouselId);

		carousel.goTo(index);
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} carouselId ID of the CarouselItem that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.Carousel.ICarousel}
	 */
	export function Initialize(carouselId: string): OSUIFramework.Patterns.Carousel.ICarousel {
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
	export function Next(carouselId: string): void {
		const carousel = GetCarouselItemById(carouselId);

		carousel.next();
	}

	/**
	 * Function to go to the previous page
	 *
	 * @export
	 * @param {string} carouselId
	 * @param {string} target
	 */
	export function Previous(carouselId: string): void {
		const carousel = GetCarouselItemById(carouselId);

		carousel.previous();
	}

	/**
	 * Function to register a provider callback
	 *
	 * @export
	 * @param {string} carouselId
	 * @param {string} eventName
	 * @param {OSUIFramework.Callbacks.OSGeneric} callback
	 */
	export function RegisterCallback(
		carouselId: string,
		eventName: string,
		callback: OSUIFramework.Callbacks.OSGeneric
	): void {
		const carousel = GetCarouselItemById(carouselId);

		carousel.registerCallback(eventName, callback);
	}

	/**
	 * Function to toggle the drag events on the Carousel
	 *
	 * @export
	 * @param {string} carouselId
	 * @param {boolean} hasDrag
	 */
	export function ToggleDrag(carouselId: string, hasDrag: boolean): void {
		const carousel = GetCarouselItemById(carouselId);

		carousel.toggleDrag(hasDrag);
	}

	/**
	 * Function that will update on DOM changes inside the Carousel
	 *
	 * @export
	 * @param {string} carouselId
	 * @return {*}  {OSUIFramework.Patterns.Carousel.ICarousel}
	 */
	export function UpdateOnRender(carouselId: string): OSUIFramework.Patterns.Carousel.ICarousel {
		const carousel = GetCarouselItemById(carouselId);

		carousel.updateOnRender();

		return carousel;
	}
}
