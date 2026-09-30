// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.GalleryAPI {
	const _galleryMap = new Map<string, OSFramework.OSUI.Patterns.Gallery.IGallery>(); //gallery.uniqueId -> Gallery obj

	/**
	 * Function that will change the property of a given gallery.
	 *
	 * @param galleryId ID of the gallery where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(galleryId: string, propertyName: string, propertyValue: unknown): string {
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
	 * @param galleryId ID of the Gallery where the instance will be created.
	 * @param configs configurations for the Gallery in JSON format.
	 * @returns the Gallery instance
	 */
	export function Create(galleryId: string, configs: string | Configs): OSFramework.OSUI.Patterns.Gallery.IGallery {
		if (_galleryMap.has(galleryId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Gallery} registered under id: ${galleryId}`
			);
		}

		const _newGallery = new OSFramework.OSUI.Patterns.Gallery.Gallery(
			galleryId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);

		_galleryMap.set(galleryId, _newGallery);

		return _newGallery;
	}

	/**
	 * Function that will destroy the instance of the given search
	 *
	 * @param galleryId
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @returns the ids of every Gallery instance
	 */
	export function GetAllGalleries(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_galleryMap);
	}

	/**
	 * Function that gets the instance of gallery, by a given ID.
	 *
	 * @param galleryId ID of the Gallery that will be looked for.
	 * @returns the Gallery instance
	 */
	export function GetGalleryById(galleryId: string): OSFramework.OSUI.Patterns.Gallery.IGallery {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap('Gallery', galleryId, _galleryMap);
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param galleryId ID of the Gallery that will be initialized.
	 * @returns the Gallery instance
	 */
	export function Initialize(galleryId: string): OSFramework.OSUI.Patterns.Gallery.IGallery {
		const gallery = GetGalleryById(galleryId);

		gallery.build();

		return gallery;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @param dropdownId
	 * @param eventName
	 * @param callback
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		dropdownId: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Gallery.FailRegisterCallback,
			callback: () => {
				const gallery = this.GetGalleryById(dropdownId);

				gallery.registerCallback(eventName, callback);
			},
		});

		return result;
	}
}
