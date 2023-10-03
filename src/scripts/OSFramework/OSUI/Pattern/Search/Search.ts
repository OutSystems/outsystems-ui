// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Search {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Search extends AbstractPattern<SearchConfig> implements ISearch {
		/**
		 * Creates an instance of Search.
		 *
		 * @param {string} uniqueId
		 * @param {JSON} configs
		 * @memberof Search
		 */
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SearchConfig(configs));
		}

		/**
		 * Sets the A11Y properties when the pattern is built.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Search.Search
		 */
		protected setA11YProperties(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Set the callbacks that will be assigned to the pattern.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Search.Search
		 */
		protected setCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Set the html references that will be used to manage the cssClasses and atribute properties.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Search.Search
		 */
		protected setHtmlElements(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Unset the callbacks that will be assigned to the pattern.
		 *
		 * @protected
		 * @memberof Search
		 */
		protected unsetCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Reassign the HTML elements to undefined, preventing memory leaks.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Search.Search
		 */
		protected unsetHtmlElements(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to build the Search
		 *
		 * @memberof OSFramework.Patterns.Search.Search
		 */
		public build(): void {
			super.build();

			this.finishBuild();
		}

		/**
		 * Destroy the Search
		 *
		 * @memberof OSFramework.Patterns.Search.Search
		 */
		public dispose(): void {
			if (this.isBuilt) {
				//Destroying the base of pattern
				super.dispose();
			}
		}
	}
}
