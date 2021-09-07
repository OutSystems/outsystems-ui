// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.CarouselAPI {
	const _carouselMap = new Map<string, OSUIFramework.Patterns.Carousel.ICarousel>();
	/**
	 * Function that will change the property of a given Carousel.
	 *
	 * @export
	 * @param {string} carouselId
	 * @param {string} propertyName
	 * @param {*} propertyValue
	 */
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	export function ChangeProperty(carouselId: string, propertyName: string, propertyValue: any): void {
		const carousel = GetCarouselById(carouselId);
		carousel.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Create the new Carousel instance and add it to the carouselsMap
	 *
	 * @export
	 * @param {string} carouselId
	 * @param {string} configs
	 * @return {*}  {OSUIFramework.Patterns.Carousel.ICarousel}
	 */
	export function Create(carouselId: string, configs: string): OSUIFramework.Patterns.Carousel.ICarousel {
		if (_carouselMap.has(carouselId)) {
			throw new Error(`There is already a carousel registered under id: ${carouselId}`);
		}

		const _newCarousel = new Providers.Carousel.Splide.Carousel.Carousel(carouselId, JSON.parse(configs));
		_carouselMap.set(carouselId, _newCarousel);
		return _newCarousel;
	}

	/**
	 * Function that will destroy the instance of the given Carousel
	 *
	 * @export
	 * @param {string} carouselId
	 */
	export function Destroy(carouselId: string): void {
		const carousel = GetCarouselById(carouselId);

		carousel.dispose();

		_carouselMap.delete(carouselId);
	}

	/**
	 * Fucntion that will return the Map with all the Carousel instances at the page
	 *
	 * @export
	 * @return {*}  {Array<string>}
	 */
	export function GetAllCarousels(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_carouselMap);
	}

	/**
	 * Function that gets the instance of Carousel, by a given ID.
	 *
	 * @export
	 * @param {string} carouselId
	 * @return {*}  {OSUIFramework.Patterns.Carousel.ICarousel}
	 */
	export function GetCarouselById(carouselId: string): OSUIFramework.Patterns.Carousel.ICarousel {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			'Carousel',
			carouselId,
			_carouselMap
		) as OSUIFramework.Patterns.Carousel.ICarousel;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} carouselId
	 * @return {*}  {OSUIFramework.Patterns.Carousel.ICarousel}
	 */
	export function Initialize(carouselId: string): OSUIFramework.Patterns.Carousel.ICarousel {
		const carousel = GetCarouselById(carouselId);

		carousel.build();

		return carousel;
	}

	/**
	 * Function that will register a pattern callback.
	 *
	 * @export
	 * @param {string} carouselId
	 * @param {OSUIFramework.Callbacks.OSCarouselChangeEvent} callback
	 */
	export function RegisterCallback(
		carouselId: string,
		callback: OSUIFramework.Callbacks.OSCarouselChangeEvent
	): void {
		const carousel = GetCarouselById(carouselId);

		carousel.registerCallback(callback);
	}
}
