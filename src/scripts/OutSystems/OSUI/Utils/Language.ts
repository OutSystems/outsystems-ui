// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Language {
	/**
	 * Method that will expose the App Language
	 *
	 * @returns All Language
	 */
	export function Get(): string {
		return OSUIFramework.Helper.Language.Lang;
	}

	/**
	 * Method that will expose the Short App Language
	 *
	 * @returns Short App Language
	 */
	export function GetShort(): string {
		return OSUIFramework.Helper.Language.ShortLang;
	}

	/**
	 * Used to set the App Language global variable based on platform GetLocale Action
	 *
	 * @param lang The Lang code to be set
	 */
	export function Set(lang: string): void {
		OSUIFramework.Helper.Language.Set(lang);
	}
}
