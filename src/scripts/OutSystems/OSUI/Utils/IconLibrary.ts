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
	 * Used as fallback guard so we do not apply twice when Initialize already ran.
	 */
	export function GetIconLibrary(): string | undefined {
		return _iconLibrary;
	}

	/**
	 * Set the icon library class value (internal). Called by Initialize after it applies the class.
	 * Do not use from application code.
	 */
	export function SetIconLibrary(value: string): void {
		_iconLibrary = value;
	}

	/**
	 * Apply icon library class to document.documentElement.
	 * Normalizes iconLibrary (strips digits/dots) and adds class `icon-library-${normalized}`.
	 *
	 * @param iconLibrary
	 */
	export function ApplyIconLibraryClass(iconLibrary: string, isInitialize: boolean): void {
		const newIconLibrary = iconLibrary.replace(/[\d.]/g, ''); // Normalizes name (strips digits/dots)
		const currentIconLibrary = IconLibrary.GetIconLibrary();

		if (currentIconLibrary === newIconLibrary) {
			return;
		}

		const htmlElement = document.documentElement;

		if (htmlElement) {
			htmlElement.classList.add(`icon-library-${newIconLibrary}`);
		}

		IconLibrary.SetIconLibrary(newIconLibrary);

		if (!isInitialize) {
			console.warn(
				'[OutSystems UI] This app is using a legacy icon configuration. To ensure compatibility with the new icons, add OutSystemsUI.SetIconLibraryClass to the Initialize event of your Layout block. Fallback support will be removed in March 2027.'
			);
		}
	}
}
