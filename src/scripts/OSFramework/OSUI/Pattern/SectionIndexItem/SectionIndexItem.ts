// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.SectionIndexItem {
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
		// Event OnBodyScroll
		private _eventOnBodyScroll: GlobalCallbacks.Generic;
		// Store the on click event
		private _eventOnClick: GlobalCallbacks.Generic;
		//Stores the keyboard callback function
		private _eventOnkeyBoardPress: GlobalCallbacks.Generic;
		// Store the header size if it's fixed!
		private _headerHeight = 0;
		// Store a flag that will be used to check if the header is fixed!
		private _headerIsFixed = true;
		// Store the state
		private _isActive = false;
		// Store the mainContent reference - The one that will have the scroll
		private _mainScrollContainerElement: HTMLElement;
		// Store TargetElement HTML object
		private _targetElement: HTMLElement = undefined;
		// Store offset top/bottom from TargetElement HTML object
		private _targetElementOffset: OffsetValues = {
			bottom: 0,
			top: 0,
		};

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SectionIndexItemConfig(configs));
		}

		/**
		 * Method to check the scroll to know if the target element is visible and sets the item as active
		 *
		 * @private
		 * @memberof SectionIndexItem
		 */
		private _onBodyScroll(): void {
			// Set target element offset info!
			this._setTargetOffsetInfo();
			// Get the vertical scroll position value
			const scrollYPosition = Behaviors.ScrollVerticalPosition(this._mainScrollContainerElement);
			// Threshold value to set element as Active
			const thresholdVal = 40;
			// Store the offSetValue to be checked
			const elementOffsetTopVal = this._targetElementOffset.top - scrollYPosition.value;

			/* Logic behind position validation:
				- If click to nanvigate into element the calc
					this.TargetElement.offsetTop - scrollYPosition.value
				will return 0(zero). That said we're setting a threshold to set as IsActive when
				this calc will between -thresholdVal and thresholdVal from that offset!
				- AND;
				- If scroll has hit the bottom and element doesn't have height enought to be placed at that
				offset it should set it as IsActive since it will be the last item in screen inside the scrollContainer.
			 */
			if (
				(this.isFirstChild && scrollYPosition.percentageInView === 0) ||
				(elementOffsetTopVal >= -thresholdVal && elementOffsetTopVal <= thresholdVal) ||
				(this.isLastChild && scrollYPosition.percentageInView === 100)
			) {
				this.notifyParent(SectionIndex.Enum.ChildNotifyActionType.Active);
			}
		}

		/**
		 * Method to set the A11y keyboard navigation
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

			// Notify parent about this Item Click
			this.notifyParent(SectionIndex.Enum.ChildNotifyActionType.Click);
		}

		/**
		 * Method to remove Pattern events
		 *
		 * @private
		 * @memberof SectionIndexItem
		 */
		private _removeEvents(): void {
			this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyBoardPress);
			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				Event.DOMEvents.Listeners.Type.BodyOnScroll,
				this._eventOnBodyScroll
			);
		}

		/**
		 * Method to check if header IsFixed
		 *
		 * @private
		 * @memberof SectionIndexItem
		 */
		private _setHeaderSize(): void {
			const header = Helper.Dom.ClassSelector(document.body, GlobalEnum.CssClassElements.Header);
			this._headerIsFixed = !!Helper.Dom.ClassSelector(document.body, GlobalEnum.CssClassElements.HeaderIsFixed);

			// If header exist and it's fixed store its height
			if (header) {
				this._headerHeight = this._headerIsFixed ? header.offsetHeight : 2 * header.offsetHeight;
			}
		}

		/**
		 * Method to add a data attribute to be used in automated tests
		 * and to have info on DOM of which element the index is pointing
		 *
		 * @private
		 * @memberof SectionIndexItem
		 */
		private _setLinkAttribute(): void {
			Helper.Dom.Attribute.Set(this.selfElement, Enum.DataTypes.dataItem, this.configs.ScrollToWidgetId);
		}

		/**
		 * Method to set the TargetElement
		 *
		 * @private
		 * @memberof SectionIndexItem
		 */
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

		/**
		 * Method to set the offset info related with TargetElement
		 *
		 * @private
		 * @memberof SectionIndexItem
		 */
		private _setTargetOffsetInfo(): void {
			// Check if TargetElement has been already defined, otherwise define it!
			this._setTargetElement();

			// Takes into account the headerSize
			this._setHeaderSize();

			// Set the target element offset top values
			this._targetElementOffset.top =
				this._targetElement.offsetTop + this._headerHeight + (this.parentObject.contentPaddingTop as number);
		}

		/**
		 * Method to set the event listeners
		 *
		 * @private
		 * @memberof SectionIndexItem
		 */
		private _setUpEvents(): void {
			this.selfElement.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this.selfElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyBoardPress);
			// Add the BodyScroll callback that will be used to update the balloon coodinates
			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
				Event.DOMEvents.Listeners.Type.BodyOnScroll,
				this._eventOnBodyScroll
			);
		}

		/**
		 * Method to add the A11Y attributes values
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.SectionIndexItem.SectionIndexItem
		 */
		protected setA11YProperties(): void {
			// Set RoleButton attribute
			Helper.A11Y.RoleButton(this.selfElement);
			// Set TabIndex
			Helper.A11Y.TabIndexTrue(this.selfElement);
		}

		/**
		 * Method to set the callbacks and event listeners
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.SectionIndexItem.SectionIndexItem
		 */
		protected setCallbacks(): void {
			this._eventOnClick = this._onSelected.bind(this);
			this._eventOnkeyBoardPress = this._onKeyboardPressed.bind(this);
			this._eventOnBodyScroll = this._onBodyScroll.bind(this);
		}

		/**
		 * Method to set the HTMLElements used
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.SectionIndexItem.SectionIndexItem
		 */
		protected setHtmlElements(): void {
			// Check if overlay is enabled => If StatusBar is enabled and if is iOS device
			/* With the introduction of the ios-bounce the overflow container change from the .active-screen into .content */
			if (
				Helper.Dom.Attribute.Has(document.body, GlobalEnum.HTMLAttributes.StatusBar) &&
				Helper.DeviceInfo.GetOperatingSystem() === GlobalEnum.MobileOS.IOS
			) {
				this._mainScrollContainerElement = Helper.Dom.ClassSelector(
					document,
					GlobalEnum.CssClassElements.Content
				);
			} else {
				this._mainScrollContainerElement = Helper.Dom.ClassSelector(
					document,
					GlobalEnum.CssClassElements.ActiveScreen
				);
			}
		}

		/**
		 *  Removes the listeners that were added in the code and unsets the callbacks.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.SectionIndexItem.SectionIndexItem
		 */
		protected unsetCallbacks(): void {
			this._removeEvents();

			this._eventOnClick = undefined;
			this._eventOnkeyBoardPress = undefined;
			this._eventOnBodyScroll = undefined;
		}

		/**
		 * Method to unset the html elements used
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.SectionIndexItem.SectionIndexItem
		 */
		protected unsetHtmlElements(): void {
			this._mainScrollContainerElement = undefined;
			this._targetElement = undefined;
		}

		/**
		 * Method to build the SectionIndexItem.
		 *
		 * @memberof OSFramework.Patterns.SectionIndexItem.SectionIndexItem
		 */
		public build(): void {
			super.build();

			this.setParentInfo(
				Constants.Dot + SectionIndex.Enum.CssClass.Pattern,
				OutSystems.OSUI.Patterns.SectionIndexAPI.GetSectionIndexById
			);

			// Notify parent about a new instance of this child has been created!
			this.notifyParent(SectionIndex.Enum.ChildNotifyActionType.Add);

			this.setCallbacks();

			this.setHtmlElements();

			this._setUpEvents();

			this.setA11YProperties();

			this._setLinkAttribute();

			this.finishBuild();
		}

		/**
		 * Applies the changes of state/value of the configurations.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof OSFramework.Patterns.SectionIndexItem.SectionIndexItem
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.ScrollToWidgetId:
						console.warn(
							`${GlobalEnum.PatternName.SectionIndex} (${this.widgetId}): change to ${Enum.Properties.ScrollToWidgetId} on property ${Enum.Properties.ScrollToWidgetId} is not editable at OnParametersChange.`
						);
						break;
				}
			}
		}

		/**
		 * Disposes the current pattern.
		 *
		 * @memberof OSFramework.Patterns.SectionIndexItem.SectionIndexItem
		 */
		public dispose(): void {
			this.unsetCallbacks();

			// Notify parent about this instance will be destroyed
			this.notifyParent(SectionIndex.Enum.ChildNotifyActionType.Removed);

			//Destroying the base of pattern
			super.dispose();
		}

		/**
		 * Adds active class from pattern.
		 *
		 * @memberof OSFramework.Patterns.SectionIndexItem.SectionIndexItem
		 */
		public setIsActive(): void {
			if (this._isActive === false) {
				this._isActive = true;
				Helper.Dom.Styles.AddClass(this.selfElement, Patterns.SectionIndex.Enum.CssClass.IsActiveItem);
			}
		}

		/**
		 * Removes active class from pattern.
		 *
		 * @memberof OSFramework.Patterns.SectionIndexItem.SectionIndexItem
		 */
		public unsetIsActive(): void {
			if (this._isActive) {
				this._isActive = false;
				Helper.Dom.Styles.RemoveClass(this.selfElement, Patterns.SectionIndex.Enum.CssClass.IsActiveItem);
			}
		}

		/**
		 * Readable property to get the active state of the element
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof OSFramework.Patterns.SectionIndexItem.SectionIndexItem
		 */
		public get IsSelected(): boolean {
			return this._isActive;
		}

		/**
		 * Readable property to get targetElement object
		 *
		 * @readonly
		 * @type {HTMLElement}
		 * @memberof OSFramework.Patterns.SectionIndexItem.SectionIndexItem
		 */
		public get TargetElement(): HTMLElement {
			return this._targetElement;
		}

		/**
		 * Readable property to get targetElementOffset info
		 *
		 * @readonly
		 * @type {OffsetValues}
		 * @memberof OSFramework.Patterns.SectionIndexItem.SectionIndexItem
		 */
		public get TargetElementOffset(): OffsetValues {
			return this._targetElementOffset;
		}
	}
}
