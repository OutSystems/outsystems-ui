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
		// Store the on click event
		private _eventOnClick: GlobalCallbacks.Generic;
		// Event OnScreenScroll
		private _eventOnScreenScroll: GlobalCallbacks.Generic;
		//Stores the keyboard callback function
		private _eventOnkeyBoardPress: GlobalCallbacks.Generic;
		// Store the state
		private _isActive = false;
		// Store the mainContent reference - The one that will have the scroll
		private _mainScrollContainerElement: HTMLElement;
		// Store TargetElement HTML object
		private _targetElement: HTMLElement = undefined;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SectionIndexItemConfig(configs));
		}

		// Method to set the A11y keyboard navigation
		private _onKeyboardPressed(event: KeyboardEvent): void {
			// If Enter or Space Keys trigger as a click event!
			if (event.key === GlobalEnum.Keycodes.Enter || event.key === GlobalEnum.Keycodes.Space) {
				event.preventDefault();
				event.stopPropagation();
				// Triggered as it was clicked!
				this._onSelected(event);
			}
		}

		// Method to check the scroll to know if the target element is visible and sets the item as active
		private _onScreenScroll(): void {
			this._setTargetElement();
			// Get the vertical scroll position value
			const scrollYPosition = Behaviors.ScrollVerticalPosition(this._mainScrollContainerElement);
			// Threshold value to set element as Active
			const thresholdVal = 40;
			// Store the offSetValue to be checked
			const elementOffsetTopVal = this._targetElement.offsetTop - scrollYPosition.value;

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

		// Method to handle the click event
		private _onSelected(event: Event): void {
			event.preventDefault();
			event.stopPropagation();
			this._setTargetElement();
			// Notify parent about this Item Click
			this.notifyParent(SectionIndex.Enum.ChildNotifyActionType.Click);
		}

		// Method to remove Pattern events
		private _removeEvents(): void {
			this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyBoardPress);
			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				Event.DOMEvents.Listeners.Type.ScreenOnScroll,
				this._eventOnScreenScroll
			);
		}

		// Method to add a data attribute to be used in automated tests and to have info on DOM of which element the index is pointing
		private _setLinkAttribute(): void {
			Helper.Dom.Attribute.Set(this.selfElement, Enum.DataTypes.dataItem, this.configs.ScrollToWidgetId);
		}

		// Method to add scroll margin styles for the item target
		private _setTargetAttributes(): void {
			// Set class to target, to avoid inline property styles
			Helper.Dom.Styles.AddClass(this._targetElement, Enum.CssClass.ItemTarget);
			// Add CSS Variable with the offset value for the scroll target, to be used on the CSS, based on parent topPosition
			this.setTargetScrollMargin(
				Helper.Dom.Styles.GetCustomProperty(
					this.parentObject.selfElement,
					SectionIndex.Enum.CssVariable.TopPosition
				)
			);
		}

		// Method to set the TargetElement
		private _setTargetElement(): void {
			// Check if the element has been already defined!
			if (this._targetElement === undefined) {
				try {
					// Can't be used the Helper.Dom.GetElementById since we don't want a through error if the element does not exist!
					this._targetElement = document.getElementById(this.configs.ScrollToWidgetId);
					this._setTargetAttributes();
				} catch (e) {
					// Was not able to get Target element!
					throw new Error(
						`${ErrorCodes.SectionIndexItem.FailToSetTargetElement}: Target Element with the Id '${this.configs.ScrollToWidgetId}' does not exist!`
					);
				}
			}
		}

		// Method to set the event listeners
		private _setUpEvents(): void {
			this.selfElement.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this.selfElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyBoardPress);
			// Add the BodyScroll callback that will be used to update the balloon coodinates
			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
				Event.DOMEvents.Listeners.Type.ScreenOnScroll,
				this._eventOnScreenScroll
			);
		}

		// Method to remove scroll margin styles on the item target
		private _unsetTargetAttributes(): void {
			// Set class to target, to avoid inline property styles
			Helper.Dom.Styles.RemoveClass(this._targetElement, Enum.CssClass.ItemTarget);
			// Add CSS Variable with the offset value for the scroll target, to be used on the CSS
			Helper.Dom.Styles.RemoveStyleAttribute(this._targetElement, Enum.CssVariable.ScrollMargin);
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
			this._eventOnScreenScroll = this._onScreenScroll.bind(this);
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
				(Helper.Dom.Attribute.Has(document.body, GlobalEnum.HTMLAttributes.StatusBar) ||
					!!window.statusbar?.visible) &&
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
			this._eventOnScreenScroll = undefined;
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

			this._unsetTargetAttributes();

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
		 * Set the scroll margin, that acts as scrollIntoView offset
		 *
		 * @param {(number | string)} margin
		 * @memberof SectionIndexItem
		 */
		public setTargetScrollMargin(margin: number | string): void {
			// Add CSS Variable with the offset value for the scroll target, to be used on the CSS
			Helper.Dom.Styles.SetStyleAttribute(this._targetElement, Enum.CssVariable.ScrollMargin, margin);
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
	}
}
