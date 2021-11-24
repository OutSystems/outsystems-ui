// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Language {
	/**
	 * Method that will expose the App Language
	 *
	 * @returns Server Date Format
	 */
	export function GetLanguage(): string {
		return OSUIFramework.Helper.Language.Lang;
	}

	/**
	 * Used to trigger the OSUIFramework method responsible for set the App Language
	 *
	 * @param date A Sample Date that will be used to set the ServerDateFormat
	 */
	export function SetLanguage(language: string): void {
		OSUIFramework.Helper.Language.SetLanguage(language);
	}
}
