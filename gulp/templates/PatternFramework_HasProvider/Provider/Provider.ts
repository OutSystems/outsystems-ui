// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.<%= patternNamePC %>.<%= providerNamePC %> {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUI<%= providerNamePC %><C extends <%= patternNamePC %>.<%= providerNamePC %>.OSUI<%= providerNamePC %>Config>
		extends OSFramework.Patterns.<%= patternNamePC %>.Abstract<%= patternNamePC %><<%= providerNamePC %>, C>
		implements OSFramework.Patterns.<%= patternNamePC %>.I<%= patternNamePC %>
	{
		/* TODO (by CreateNewPattern):
				Add provider as a module dependency and define:
					- <%= providerNamePC %>Opts;
		 */

		// Store the provider options
		protected _<%= providerName %>Opts: <%= providerNamePC %>Opts;

		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		// Create the provider instance
		private _createProviderInstance(): void {
			// TODO (by CreateNewPattern): create the provider instance
			// this.provider = ...
		}

		/**
		 * Sets the callbacks to be used with the provider.
		 *
		 * @protected
		 * @memberof OSUI<%= providerNamePC %>
		 */
		 protected setCallbacks(): void {
			// TODO (by CreateNewPattern): Update or Remove
		}

		/**
		 * Method to set the html elements used
		 *
		 * @protected
		 * @memberof OSUI<%= providerNamePC %>
		 */
		 protected setHtmlElements(): void {
			// TODO (by CreateNewPattern): Update or Remove
		}

		/**
		 * Unset callbacks that has been assigned to the element
		 *
		 * @protected
		 * @memberof OSUI<%= providerNamePC %>
		 */
		protected unsetCallbacks(): void {
			// TODO (by CreateNewPattern): Update or Remove
		}

		public build(): void {
			super.build();

			this.setCallbacks();

			this.setHtmlElements();

			this._createProviderInstance();

			super.finishBuild();
		}

		/**
		 * Update property value from a given property name at OnParametersChange
		 *
		 * @param {string} propertyName the name of the property that will be changed
		 * @param {unknown} propertyValue the new value that should be assigned to the given property name
		 * @memberof OSUI<%= providerNamePC %>
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSFramework.Patterns.<%= patternNamePC %>.Enum.Properties.PROP_NAME:
						// TODO (by CreateNewPattern): Update or Remove
					break;
				}
			}
		}

		/**
		 * Destroy the <%= patternNamePC %>.
		 *
		 * @memberof OSUI<%= providerNamePC %>
		 */
		public dispose(): void {
			this.provider.destroy();

			this.unsetCallbacks();

			super.dispose();
		}

		/**
		 * Method used to register the provider callback
		 *
		 * @param {string} eventName Event name that will be assigned
		 * @param {OSFramework.Callbacks.OSGeneric} callback Function name that will be passed as a callback function to the event above
		 * @memberof OSUI<%= providerNamePC %>
		 */
		public registerCallback(eventName: string, callback: OSFramework.Callbacks.OSGeneric): void {
			switch (eventName) {
				case OSFramework.Patterns.<%= patternNamePC %>.Enum.Events.EVENT_NAME:
						// TODO (by CreateNewPattern): Update or Remove
					break;

				default:
					/* TODO (by CreateNewPattern): 
						The line below is created by the CreateNewPattern mechanism, that is not able to replace values
						as expected, that said, check other patterns to understand how to replace it!
					*/
					throw new Error("The givem '"+ eventName + "' event name it's not defined.");
			}
		}

		
	}
}
