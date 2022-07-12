// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.<%= patternNamePC %> {
	/**
	 *  Class that implements the <%= patternNamePC %> pattern.
	 *
	 * @export
	 * @class <%= patternNamePC %>
	 * @extends {AbstractPattern<<%= patternNamePC %>Config>}
	 * @implements {I<%= patternNamePC %>}
	 */
	export class <%= patternNamePC %> extends AbstractPattern<<%= patternNamePC %>Config> implements I<%= patternNamePC %> {
		// Properties

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new <%= patternNamePC %>Config(configs));
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof <%= patternNamePC %>
		 */
		protected setA11yProperties(): void {
			// TODO (by CreateNewPattern) Update or Remove
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof <%= patternNamePC %>
		 */
		protected setHtmlElements(): void {
			// TODO (by CreateNewPattern) Update or Remove
		}

		/**
		 * Removes the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof <%= patternNamePC %>
		 */
		protected unsetHtmlElements(): void {
			// TODO (by CreateNewPattern) Update or Remove
		}

		/**
		 *  Builds the <%= patternNamePC %>.
		 *
		 * @memberof <%= patternNamePC %>
		 */
		public build(): void {
			super.build();

			this.setHtmlElements();

			this.setA11yProperties();

			this.finishBuild();
		}

		/**
		 * Applies the changes of state/value of the configurations.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof <%= patternNamePC %>
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.PROP_NAME:
						// TODO (by CreateNewPattern) Update or Remove
						break;

					case Enum.Properties.PROP_NAME2:
						// TODO (by CreateNewPattern) Update or Remove
						break;
					
					case Enum.Properties.PROP_NAME3:
						// TODO (by CreateNewPattern) Update or Remove
					break;
				}
			}
		}

		/**
		 * Disposes the current pattern.
		 *
		 * @memberof <%= patternNamePC %>
		 */
		public dispose(): void {
			this.unsetHtmlElements();
			
			//Destroying the base of pattern
			super.dispose();
		}
	}
}
