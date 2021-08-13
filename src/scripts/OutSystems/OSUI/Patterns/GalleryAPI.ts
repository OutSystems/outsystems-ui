// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.GalleryAPI {
	const galleryMap = new Map<string, OSUIFramework.Patterns.Gallery.IGallery>(); //gallery.uniqueId -> Gallery obj

	/**
	 * Function that will change the property of a given gallery.
	 *
	 * @export
	 * @param {string} widgetId ID of the gallery where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(widgetId: string, propertyName: string, propertyValue: any): void {
		const gallery = GetGalleryById(widgetId);

		gallery.changeProperty(propertyName, propertyValue);
	}
	/**
	 * Create the new gallery instance and add it to the galleryMap
	 *
	 * @export
	 * @param {string} widgetId ID of the Gallery where the instance will be created.
	 * @param {string} configs configurations for the Gallery in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.IGallery}
	 */
	export function Create(widgetId: string, configs: string): OSUIFramework.Patterns.Gallery.IGallery {
		if (galleryMap.has(widgetId)) {
			throw new Error(`There is already a gallery registered under id: ${widgetId}`);
		}

		const _newGallery = new OSUIFramework.Patterns.Gallery.Gallery(widgetId, JSON.parse(configs));

		galleryMap.set(widgetId, _newGallery);

		return _newGallery;
	}

	/**
	 * Fucntion that will return the Map with all the gallery instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSUIFramework.Patterns.IGallery>}
	 */
	export function GetAllGalleriesMap(): Map<string, OSUIFramework.Patterns.Gallery.IGallery> {
		return galleryMap;
	}

	/**
	 * Function that gets the instance of gallery, by a given ID.
	 *
	 * @export
	 * @param {string} widgetId ID of the Gallery that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.IGallery}
	 */
	export function GetGalleryById(widgetId: string): OSUIFramework.Patterns.Gallery.IGallery {
		let gallery: OSUIFramework.Patterns.Gallery.IGallery;

		//widgetId is the UniqueId
		if (galleryMap.has(widgetId)) {
			gallery = galleryMap.get(widgetId);
		} else {
			//Search for WidgetId
			for (const p of galleryMap.values()) {
				if (p.equalsToID(widgetId)) {
					gallery = p;
					break;
				}
			}
		}

		if (gallery === undefined) {
			throw new Error(`Gallery id:${widgetId} not found`);
		}

		return gallery;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} widgetId ID of the Gallery that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.GalleryIGallery}
	 */
	export function Initialize(widgetId: string): OSUIFramework.Patterns.Gallery.IGallery {
		const gallery = GetGalleryById(widgetId);

		gallery.build();

		return gallery;
	}
}
