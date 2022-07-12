// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.GalleryAPI {
	const _galleryMap = new Map<string, OSFramework.Patterns.Gallery.IGallery>(); //gallery.uniqueId -> Gallery obj

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
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const gallery = GetGalleryById(galleryId);

			gallery.changeProperty(propertyName, propertyValue);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Gallery.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
	}
	/**
	 * Create the new gallery instance and add it to the galleryMap
	 *
	 * @export
	 * @param {string} galleryId ID of the Gallery where the instance will be created.
	 * @param {string} configs configurations for the Gallery in JSON format.
	 * @return {*}  {OSFramework.Patterns.IGallery}
	 */
	export function Create(galleryId: string, configs: string): OSFramework.Patterns.Gallery.IGallery {
		if (_galleryMap.has(galleryId)) {
			throw new Error(
				`There is already a ${OSFramework.GlobalEnum.PatternName.Gallery} registered under id: ${galleryId}`
			);
		}

		const _newGallery = new OSFramework.Patterns.Gallery.Gallery(galleryId, JSON.parse(configs));

		_galleryMap.set(galleryId, _newGallery);

		return _newGallery;
	}

	/**
	 * Function that will destroy the instance of the given search
	 *
	 * @export
	 * @param {string} galleryId
	 */
	export function Dispose(galleryId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const gallery = GetGalleryById(galleryId);

			gallery.dispose();

			_galleryMap.delete(galleryId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Gallery.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Fucntion that will return the Map with all the gallery instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSFramework.Patterns.IGallery>}
	 */
	export function GetAllGalleries(): Array<string> {
		return OSFramework.Helper.MapOperation.ExportKeys(_galleryMap);
	}

	/**
	 * Function that gets the instance of gallery, by a given ID.
	 *
	 * @export
	 * @param {string} galleryId ID of the Gallery that will be looked for.
	 * @return {*}  {OSFramework.Patterns.IGallery}
	 */
	export function GetGalleryById(galleryId: string): OSFramework.Patterns.Gallery.IGallery {
		return OSFramework.Helper.MapOperation.FindInMap('Gallery', galleryId, _galleryMap);
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} galleryId ID of the Gallery that will be initialized.
	 * @return {*}  {OSFramework.Patterns.GalleryIGallery}
	 */
	export function Initialize(galleryId: string): OSFramework.Patterns.Gallery.IGallery {
		const gallery = GetGalleryById(galleryId);

		gallery.build();

		return gallery;
	}
}
