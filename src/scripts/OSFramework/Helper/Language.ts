// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Helper {
	export abstract class Language {
		/**
		 * App Language
		 */
		private static _lang = 'en-US';

		/**
		 * Getter that allows to obtain the App Language based on SetLocale Action from platform!
		 *
		 * @readonly
		 * @static
		 * @type {string}
		 * @memberof Language
		 */
		public static get Lang(): string {
			return Language._lang;
		}

		/**
		 * Getter that allows to obtain the App Language with 2 characters only
		 *
		 * @readonly
		 * @static
		 * @type {string}
		 * @memberof Language
		 */
		public static get ShortLang(): string {
			return Language._lang.substring(0, 2);
		}

		/**
		 * Function responsible for setting up the the app language
		 *
		 * @param language The value returned by platform GetCurrentLocale() method
		 */
		public static Set(language: string): void {
			Language._lang = language;
		}
	}
}
