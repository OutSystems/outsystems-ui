// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	export abstract class Language {
		/**
		 * App Language
		 */
		private static _lang = '';

		public static get Lang(): string {
			return Language._lang;
		}

		/**
		 * Function responsible for setting up the the app language
		 *
		 * @param language The value returned by platform GetCurrentLocale() method
		 */
		public static SetLanguage(language: string): void {
			Language._lang = language;
		}
	}
}
