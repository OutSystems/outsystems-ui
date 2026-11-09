// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Search {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Search extends AbstractPattern<SearchConfig> implements ISearch {
		/**
		 * Creates an instance of Search.
		 *
		 * @param uniqueId Unique id of the pattern instance (the widget id)
		 * @param configs Configuration object received from the platform
		 */
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SearchConfig(configs));
		}

		/**
		 * Sets the A11Y properties when the pattern is built.
		 *
		 * @protected
		 */
		protected setA11YProperties(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
			// The pattern wraps the search input, so it is the search landmark of the screen.
		}

		/**
		 * Set the callbacks that will be assigned to the pattern.
		 *
		 * @protected
		 */
		protected setCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Set the html references that will be used to manage the cssClasses and atribute properties.
		 *
		 * @protected
		 */
		protected setHtmlElements(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Unset the callbacks that will be assigned to the pattern.
		 *
		 * @protected
		 */
		protected unsetCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Reassign the HTML elements to undefined, preventing memory leaks.
		 *
		 * @protected
		 */
		protected unsetHtmlElements(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to build the Search
		 */
		public build(): void {
			super.build();

			this.finishBuild();
		}

		/**
		 * Destroy the Search
		 */
		public dispose(): void {
			if (this.isBuilt) {
				//Destroying the base of pattern
				super.dispose();
			}
		}
	}
}
