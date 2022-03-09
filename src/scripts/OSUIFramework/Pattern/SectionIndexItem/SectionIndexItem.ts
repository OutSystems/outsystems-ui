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
		// Store TargetElement HTML object
		private _targetElement: HTMLElement = undefined;
		// Store offset top/bottom from TargetElement HTML object
		private _targetElementOffset: SectionIndexItemOffsetInfo = {
			bottom: 0,
			top: 0,
		};

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

			// Update the offsetInfo when clicked since we could have expandable containers that will change this values accoring the scroll content height
			this._setTargetOffsetInfo();

			// Notify parent about this Option Click
			this.notifyParent(Providers.Dropdown.OSUIComponents.Enum.ChildNotifyActionType.Click);
		}

		// Remove Pattern Events
		private _removeEvents(): void {
			this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyBoardPress);
		}

		// Set TargetElement
		private _setTargetElement(): void {
			// Check if the element has been already defined!
			if (this._targetElement === undefined) {
				try {
					// Can't be used the Helper.Dom.GetElementById since we don't want a through error if the element does not exist!
					this._targetElement = document.getElementById(this.configs.ScrollToWidgetId);
				} catch (e) {
					// Was not able to get Target element!
					throw new Error(
						`${ErrorCodes.SectionIndexItem.FailToSetTargetElement}: Target Element with the Id '${this.configs.ScrollToWidgetId}' does not exist!`
					);
				}
			}
		}

		// Set offset info related with TargetElement
		private _setTargetOffsetInfo(): void {
			// Check if TargetElement has been already defined, otherwise define it!
			this._setTargetElement();

			// Set the target element offset top/bottom values
			this._targetElementOffset.bottom = this._targetElement.offsetTop + this._targetElement.offsetHeight;
			this._targetElementOffset.top = this._targetElement.offsetTop;
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
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof SectionIndexItem
		 */
		protected setA11yProperties(): void {
			// Set RoleButton attribute
			Helper.A11Y.RoleButton(this.selfElement);
			// Set TabIndex
			Helper.A11Y.TabIndexTrue(this.selfElement);
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

			this.setCallbacks();

			this._setUpEvents();

			this.setA11yProperties();

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
						console.warn(
							`${GlobalEnum.PatternsNames.SectionIndex} (${this.widgetId}): change to ${Enum.Properties.ScrollToWidgetId} on property ${Enum.Properties.ScrollToWidgetId} is not editable at OnParametersChange.`
						);
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
		 * Adds active class from pattern.
		 *
		 * @memberof SectionIndexItem
		 */
		public setIsActive(): void {
			Helper.Dom.Styles.AddClass(this._selfElem, Patterns.SectionIndex.Enum.CssClass.IsActiveItem);
		}

		/**
		 * Removes active class from pattern.
		 *
		 * @memberof SectionIndexItem
		 */
		public unsetIsActive(): void {
			Helper.Dom.Styles.RemoveClass(this._selfElem, Patterns.SectionIndex.Enum.CssClass.IsActiveItem);
		}

		/**
		 * Readable property to get targetElement object
		 *
		 * @readonly
		 * @type {HTMLElement}
		 * @memberof SectionIndexItem
		 */
		public get targetElement(): HTMLElement {
			return this._targetElement;
		}

		/**
		 * Readable property to get targetElementOffset info
		 *
		 * @readonly
		 * @type {SectionIndexItemOffsetInfo}
		 * @memberof SectionIndexItem
		 */
		public get targetElementOffset(): SectionIndexItemOffsetInfo {
			return this._targetElementOffset;
		}
	}
}
