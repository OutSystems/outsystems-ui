// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.GalleryAPI {
	const _galleryMap = new Map<string, OSFramework.OSUI.Patterns.Gallery.IGallery>(); //gallery.uniqueId -> Gallery obj

	/**
	 * Function that will change the property of a given gallery.
	 *
	 * @export
	 * @param {string} galleryId ID of the gallery where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(galleryId: string, propertyName: string, propertyValue: any): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Gallery.FailChangeProperty,
			callback: () => {
				const gallery = GetGalleryById(galleryId);

				gallery.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}
	/**
	 * Create the new gallery instance and add it to the galleryMap
	 *
	 * @export
	 * @param {string} galleryId ID of the Gallery where the instance will be created.
	 * @param {string} configs configurations for the Gallery in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.IGallery}
	 */
	export function Create(galleryId: string, configs: string): OSFramework.OSUI.Patterns.Gallery.IGallery {
		if (_galleryMap.has(galleryId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Gallery} registered under id: ${galleryId}`
			);
		}

		const _newGallery = CreatePatternInstance(galleryId, configs);

		_galleryMap.set(galleryId, _newGallery);

		return _newGallery;
	}

	/**
	 * Create and return Pattern Instance
	 *
	 * @export
	 * @param {string} galleryId
	 * @param {string} configs
	 * @return {*}  {OSFramework.OSUI.Patterns.Gallery.IGallery }
	 */
	export function CreatePatternInstance(
		galleryId: string,
		configs: string
	): OSFramework.OSUI.Patterns.Gallery.IGallery {
		return new OSFramework.OSUI.Patterns.Gallery.Gallery(galleryId, JSON.parse(configs));
	}

	/**
	 * Function that will destroy the instance of the given search
	 *
	 * @export
	 * @param {string} galleryId
	 */
	export function Dispose(galleryId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Gallery.FailDispose,
			callback: () => {
				const gallery = GetGalleryById(galleryId);

				gallery.dispose();

				_galleryMap.delete(galleryId);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the gallery instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSFramework.OSUI.Patterns.IGallery>}
	 */
	export function GetAllGalleries(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_galleryMap);
	}

	/**
	 * Function that gets the instance of gallery, by a given ID.
	 *
	 * @export
	 * @param {string} galleryId ID of the Gallery that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.IGallery}
	 */
	export function GetGalleryById(galleryId: string): OSFramework.OSUI.Patterns.Gallery.IGallery {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap('Gallery', galleryId, _galleryMap);
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} galleryId ID of the Gallery that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.GalleryIGallery}
	 */
	export function Initialize(galleryId: string): OSFramework.OSUI.Patterns.Gallery.IGallery {
		const gallery = GetGalleryById(galleryId);

		gallery.build();

		return gallery;
	}
}
