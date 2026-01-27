// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Helper {
	export abstract class Language {

		/**
		 * Getter that allows to obtain the App Language based on SetLocale Action from platform!
		 *
		 * @readonly
		 * @static
		 * @type {string}
		 * @memberof OSFramework.Helper.Language
		 */
		public static get Lang(): string {

			if (document.documentElement.lang === undefined) {
				return Constants.Language.code;
			} else {
				return document.documentElement.lang;
			}
		}

		/**
		 * Getter that allows to obtain the App Language with 2 characters only
		 *
		 * @readonly
		 * @static
		 * @type {string}
		 * @memberof OSFramework.Helper.Language
		 */
		public static get ShortLang(): string {
			if (document.documentElement.lang === undefined) {
				return Constants.Language.code.substring(0, 2);
			} else {
				return document.documentElement.lang.substring(0, 2);
			}
		}

		/**
		 * Function responsible for setting up the the app language
		 *
		 * @param language The value returned by platform GetCurrentLocale() method
		 */
		public static Set(language: string): void {
			// Check if the given lang is not empty or has been already assigned
			if (language !== '') {
				document.documentElement.lang = language;
			}
		}
	}
}
