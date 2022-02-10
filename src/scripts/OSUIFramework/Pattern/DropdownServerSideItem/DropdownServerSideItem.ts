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
		private _dropdownParent: OSUIFramework.Patterns.Dropdown.IDropdown;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new DropdownServerSideItemConfig(configs));

			console.log(this.uniqueId + ' DropdownServerSideItem - constructor()');
		}

		// Function used to get the reference of Dropdown parent
		private _getDropdownParent(): void {
			try {
				// Get the uniqueId from the dropdownParent
				const dropdownParentId = Helper.Dom.Attribute.Get(
					this._selfElem.closest(Constants.Dot + Enum.CssClass.DropdownParent),
					GlobalEnum.HTMLAttributes.Name
				);

				// Get the Dropdown parent reference
				this._dropdownParent = OutSystems.OSUI.Patterns.DropdownAPI.GetDropdownById(dropdownParentId);

				this._notifyDropdownParent();
			} catch (e) {
				// Was not able to get Dropdown parent element!
				throw new Error(
					OSUIFramework.ErrorCodes.DropdownServerSideItem.DropdownParentNotFound.code +
						': ' +
						`${GlobalEnum.PatternsNames.Dropdown} parent of ${GlobalEnum.PatternsNames.DropdownServerSideItem} id: '${this.widgetId}' was not found!`
				);
			}
		}

		// Method that will notify Dropdpwn parent about this new instance has been created!
		private _notifyDropdownParent(): void {
			// Notify parent and receive OK from it that this instance is really a child of it!
			console.log('NOTIFY:', this._dropdownParent);
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof DropdownServerSideItem
		 */
		protected setA11yProperties(): void {
			// console.log(
			// 	this.uniqueId +
			// 		' DropdownServerSideItem - setA11yProperties => TODO (by CreateNewPattern) Update or Remove'
			// );
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof DropdownServerSideItem
		 */
		protected setHtmlElements(): void {
			// console.log(
			// 	this.uniqueId +
			// 		' DropdownServerSideItem - setHtmlElements => TODO (by CreateNewPattern) Update or Remove'
			// );
		}

		/**
		 * Removes the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof DropdownServerSideItem
		 */
		protected unsetHtmlElements(): void {
			// console.log(
			// 	this.uniqueId +
			// 		' DropdownServerSideItem - unsetHtmlElements => TODO (by CreateNewPattern) Update or Remove'
			// );
		}

		/**
		 *  Builds the DropdownServerSideItem.
		 *
		 * @memberof DropdownServerSideItem
		 */
		public build(): void {
			console.log(this.uniqueId + ' DropdownServerSideItem - build()');

			super.build();

			this._getDropdownParent();

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
			// console.log(this.uniqueId + ' DropdownServerSideItem - changeProperty()');

			super.changeProperty(propertyName, propertyValue);

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
		public registerCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			// console.log(this.uniqueId + ' DropdownServerSideItem - registerCallback()');
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
