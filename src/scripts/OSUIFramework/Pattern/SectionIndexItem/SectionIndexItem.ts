// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.SectionIndexItem {
	/**
	 *  Class that implements the SectionIndexItem pattern.
	 *
	 * @export
	 * @class SectionIndexItem
	 * @extends {AbstractPattern<SectionIndexItemConfig>}
	 * @implements {ISectionIndexItem}
	 */

	export class SectionIndexItem
		extends AbstractChild<SectionIndexItemConfig, SectionIndex.ISectionIndex>
		implements ISectionIndexItem
	{
		// Store the on click event
		private _eventOnClick: Callbacks.Generic;
		//Stores the keyboard callback function
		private _eventOnkeyBoardPress: Callbacks.Generic;
		// Store if this is the current active item
		private _isActive = false;
		// Stores the Target element Id of this item
		public sectionIndexItemTargetId: string;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SectionIndexItemConfig(configs));
		}

		/**
		 * A11y keyboard navigation
		 *
		 * @private
		 * @param {KeyboardEvent} event
		 * @memberof SectionIndexItem
		 */
		private _onKeyboardPressed(event: KeyboardEvent): void {
			event.preventDefault();
			event.stopPropagation();

			switch (event.key) {
				// If Enter or Space Keys trigger as a click event!
				case GlobalEnum.Keycodes.Enter:
				case GlobalEnum.Keycodes.Space:
					// Triggered as it was clicked!
					this._onSelected(event);
					break;
			}
		}

		/**
		 * Method to handle the click event
		 *
		 * @private
		 * @param {Event} event
		 * @memberof SectionIndexItem
		 */
		private _onSelected(event: Event): void {
			event.preventDefault();
			event.stopPropagation();

			// Notify parent about this Option Click
			this.notifyParent(Providers.Dropdown.OSUIComponents.Enum.ChildNotifyActionType.Click);
		}

		// Remove Pattern Events
		private _removeEvents(): void {
			this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyBoardPress);
		}

		/**
		 * Method to set the event listeners
		 *
		 * @private
		 * @memberof SectionIndexItem
		 */
		private _setUpEvents(): void {
			this._selfElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this._selfElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyBoardPress);
		}

		/**
		 * Method to set the callbacks and event listeners
		 *
		 * @protected
		 * @memberof SectionIndexItem
		 */
		protected setCallbacks(): void {
			this._eventOnClick = this._onSelected.bind(this);
			this._eventOnkeyBoardPress = this._onKeyboardPressed.bind(this);
		}

		/**
		 * Method to set the variables needed on this pattern
		 *
		 * @protected
		 * @memberof SectionIndexItem
		 */
		protected setUpSectionItemIndex(): void {
			if (this.sectionIndexItemTargetId === undefined) {
				this.sectionIndexItemTargetId = this.configs.ScrollToWidgetId;
			}
		}

		/**
		 *  Builds the SectionIndexItem.
		 *
		 * @memberof SectionIndexItem
		 */
		public build(): void {
			super.build();

			this.setParent(
				Constants.Dot + SectionIndex.Enum.CssClass.Pattern,
				OutSystems.OSUI.Patterns.SectionIndexAPI.GetSectionIndexById
			);

			// Notify parent about a new instance of this child has been created!
			this.notifyParent(SectionIndex.Enum.ChildNotifyActionType.Add);

			this.setUpSectionItemIndex();

			this.setCallbacks();

			this._setUpEvents();

			this.finishBuild();
		}

		/**
		 * Applies the changes of state/value of the configurations.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof SectionIndexItem
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.ScrollToWidgetId:
						// TODO (by CreateNewPattern) Update or Remove
						break;
				}
			}
		}

		/**
		 * Disposes the current pattern.
		 *
		 * @memberof SectionIndexItem
		 */
		public dispose(): void {
			this._removeEvents();

			// Notify parent about this instance will be destroyed
			this.notifyParent(SectionIndex.Enum.ChildNotifyActionType.Removed);

			//Destroying the base of pattern
			super.dispose();
		}

		/**
		 * Removes active class from pattern.
		 *
		 * @memberof SectionIndexItem
		 */
		public removeActiveElement(): void {
			if (this._selfElem) {
				this._isActive = false;
				Helper.Dom.Styles.RemoveClass(this._selfElem, Patterns.SectionIndex.Enum.CssClass.ActiveItem);
			}
		}

		/**
		 * Adds active class from pattern.
		 *
		 * @memberof SectionIndexItem
		 */
		public setActiveElement(): void {
			if (this._selfElem) {
				this._isActive = true;
				Helper.Dom.Styles.AddClass(this._selfElem, Patterns.SectionIndex.Enum.CssClass.ActiveItem);
			}
		}
	}
}
