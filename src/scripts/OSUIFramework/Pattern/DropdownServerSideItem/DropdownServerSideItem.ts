// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.DropdownServerSideItem {
	/**
	 *  Class that implements the DropdownServerSideItem pattern.
	 *
	 * @export
	 * @class DropdownServerSideItem
	 * @extends {AbstractPattern<DropdownServerSideItemConfig>}
	 * @implements {IDropdownServerSideItem}
	 */
	export class DropdownServerSideItem
		extends AbstractPattern<DropdownServerSideItemConfig>
		implements IDropdownServerSideItem
	{
		// Properties

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new DropdownServerSideItemConfig(configs));
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof DropdownServerSideItem
		 */
		protected setA11yProperties(): void {
			// TODO (by CreateNewPattern) Update or Remove
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof DropdownServerSideItem
		 */
		protected setHtmlElements(): void {
			// TODO (by CreateNewPattern) Update or Remove
		}

		/**
		 * Removes the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof DropdownServerSideItem
		 */
		protected unsetHtmlElements(): void {
			// TODO (by CreateNewPattern) Update or Remove
		}

		/**
		 *  Builds the DropdownServerSideItem.
		 *
		 * @memberof DropdownServerSideItem
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
		 * @memberof DropdownServerSideItem
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			console.log('DO THINGS HERE!');
			// if (this.isBuilt) {
			// 	switch (propertyName) {
			// 		case Enum.Properties.PROP_NAME:
			// 			// TODO (by CreateNewPattern) Update or Remove
			// 			break;
			// 	}
			// }
		}

		/**
		 * Disposes the current pattern.
		 *
		 * @memberof DropdownServerSideItem
		 */
		public dispose(): void {
			this.unsetHtmlElements();

			//Destroying the base of pattern
			super.dispose();
		}
		/**
		 * Method used to register the callback
		 *
		 * @param {string} eventName Event name that will be assigned
		 * @param {OSUIFramework.Callbacks.OSGeneric} callback Function name that will be passed as a callback function to the event above
		 * @memberof DropdownServerSideItem
		 */
		public registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			console.log('DO THINGS HERE!');
			// switch (eventName) {
			// 	case OSUIFramework.Patterns.Dropdown.Enum.Events.Initialized:
			// 		if (this._platformEventInitializedCallback === undefined) {
			// 			this._platformEventInitializedCallback = callback;
			// 		}
			// 		break;
			// 	default:
			// 		throw new Error(`The given '${eventName}' event name it's not defined.`);
			// }
		}
	}
}
