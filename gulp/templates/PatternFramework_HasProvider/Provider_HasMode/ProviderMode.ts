/// <reference path="../Abstract<%= providerNamePC %>.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.<%= patternNamePC %>.<%= providerNamePC %>.<%= modeNamePC %> {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUI<%= providerNamePC %><%= modeNamePC %> extends Abstract<%= providerNamePC %><<%= providerNamePC %><%= modeNamePC %>Config> {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new <%= providerNamePC %><%= modeNamePC %>Config(configs));
		}

		/**
		 * Method that will set the provider configurations in order to properly create its instance
		 *
		 * @protected
		 * @memberof OSUI<%= providerNamePC %><%= modeNamePC %>
		 */
		protected prepareConfigs(): void {
			// Get the library configurations
			this._<%= providerName %>Opts = this.configs.getProviderConfig();

			// Instance will be Created!
			super.createProviderInstance();
		}

		/**
		 * Update property value from a given property name at OnParametersChange
		 *
		 * @param {string} propertyName the name of the property that will be changed
		 * @param {unknown} propertyValue the new value that should be assigned to the given property name
		 * @memberof OSUI<%= providerNamePC %><%= modeNamePC %>
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.PROP_NAME:
						// TODO (by CreateNewPattern): Update or Remove
						break;
				}
			}
		}
	}
}
