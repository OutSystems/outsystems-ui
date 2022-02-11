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
		// Store a reference to the Dropdpown parent Element
		private _dropdownParentElement: HTMLElement;
		// Store the id of of the Dropdown parent
		private _dropdownParentId: string;
		// Store a reference to item Dropdpwn parent Element
		private _dropdownParentReference: Patterns.Dropdown.IDropdown;
		// Click Event
		private _platformEventOnClickCallback: Callbacks.OSGeneric;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new DropdownServerSideItemConfig(configs));

			console.log('NEW DropdownSS___Item', this.uniqueId);
		}

		// Function used to get the reference of Dropdown parent
		private _getDropdownParent(): void {
			try {
				const dropdownParentBallonElement = this._selfElem.closest(
					Constants.Dot + Enum.CssClass.DropdownParentBallon
				) as HTMLElement;

				this._dropdownParentId = dropdownParentBallonElement.dataset.dropdownUniqueid;
			} catch (e) {
				// Was not able to get Dropdown parent element!
				throw new Error(
					`${ErrorCodes.DropdownServerSideItem.DropdownParentNotFound}: ${GlobalEnum.PatternsNames.Dropdown} parent of ${GlobalEnum.PatternsNames.DropdownServerSideItem} id: '${this.widgetId}' was not found!`
				);
			}

			// Notify parent about a new instance of this child has been created!
			this._notifyDropdownParent(Enum.ActionType.Add);
		}

		// Method that will notify Dropdpwn parent in order to update it's references to DropdownOptionItems!
		private _notifyDropdownParent(type: Enum.ActionType): void {
			// Get the Dropdown parent HTML element
			this._dropdownParentElement = Helper.Dom.GetElementByUniqueId(this._dropdownParentId);

			// If Dropdown Exist at Dom
			if (this._dropdownParentElement !== undefined) {
				// Get the DropdownParent reference
				this._dropdownParentReference = OutSystems.OSUI.Patterns.DropdownAPI.GetDropdownById(
					this._dropdownParentId
				);

				// Trigger the notification into parent
				switch (type) {
					case Enum.ActionType.Add:
						this._dropdownParentReference.setNewOptionItem(this.uniqueId);
						break;
					case Enum.ActionType.Remove:
						this._dropdownParentReference.unsetNewOptionItem(this.uniqueId);
						break;
				}
			} else if (Enum.ActionType.Add) {
				throw new Error(
					`${ErrorCodes.DropdownServerSideItem.DropdownParentNotFound}: ${GlobalEnum.PatternsNames.Dropdown} parent of ${GlobalEnum.PatternsNames.DropdownServerSideItem} id: '${this.widgetId}' was not found!`
				);
			}
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
		 * Unset callbacks that has been assigned to the element
		 *
		 * @protected
		 * @memberof DropdownServerSideItem
		 */
		protected unsetCallbacks(): void {
			console.log(
				this.uniqueId + ' DropdownServerSide - unsetCallbacks() => TODO (by CreateNewPattern): Update or Remove'
			);
		}

		/**
		 * Method to unset the html elements used
		 *
		 * @protected
		 * @memberof DropdownServerSideItem
		 */
		protected unsetHtmlElements(): void {
			this._dropdownParentElement = undefined;
			this._dropdownParentId = undefined;
			this._dropdownParentReference = undefined;
		}

		/**
		 *  Builds the DropdownServerSideItem.
		 *
		 * @memberof DropdownServerSideItem
		 */
		public build(): void {
			super.build();

			this._getDropdownParent();

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

			// Notify parent about this instance will be destroyed
			this._notifyDropdownParent(Enum.ActionType.Remove);

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
		public registerCallback(eventName: string, callback: Callbacks.OSGeneric): void {
			switch (eventName) {
				case Enum.Events.OnSelected:
					if (this._platformEventOnClickCallback === undefined) {
						this._platformEventOnClickCallback = callback;
					}
					break;
				default:
					throw new Error(`The given '${eventName}' event name it's not defined.`);
			}
		}
	}
}
