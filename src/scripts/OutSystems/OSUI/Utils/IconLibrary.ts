// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.IconLibrary {
	/**
	 * Icon library state and helpers (ODC only).
	 * This file is excluded from the O11 build.
	 */

	/** Private state: icon library class set by Initialize or by SetIconLibraryClass fallback. */
	let _iconLibrary: string | undefined;

	/**
	 * Get the icon library class already set, if any.
	 */
	export function GetIconLibrary(): string | undefined {
		return _iconLibrary;
	}

	/**
	 * Set the icon library class value (internal). Called by Initialize after it applies the class.
	 */
	export function SetIconLibrary(value: string): void {
		_iconLibrary = value;
	}

	/**
	 * Apply icon library class to document.documentElement.
	 * Normalizes iconLibrary (strips digits/dots) and adds class `icon-library-${normalized}`.
	 *
	 * @export
	 * @param {string} iconLibrary
	 * @param {boolean} isInitialize
	 * @return {*}  {void}
	 */
	export function ApplyIconLibraryClass(iconLibrary: string, isInitialize: boolean): void {
		const newIconLibrary = iconLibrary.replace(/[\d.]/g, '').toLowerCase(); // Normalizes name (strips digits/dots, lowercases)
		const currentIconLibrary = IconLibrary.GetIconLibrary();

		if (currentIconLibrary === newIconLibrary || newIconLibrary === '') {
			return;
		}

		const htmlElement = document.documentElement;

		if (htmlElement) {
			htmlElement.classList.add(`iconLibrary-${newIconLibrary}`);
		}

		IconLibrary.SetIconLibrary(newIconLibrary);

		if (!isInitialize) {
			console.warn(
				'[OutSystems UI] This app is using a legacy icon configuration. To ensure compatibility with the new icons, add OutSystemsUI.SetIconLibraryClass to the Initialize event of your Layout block. Fallback support will be removed in March 2027.'
			);
		}
	}
}
