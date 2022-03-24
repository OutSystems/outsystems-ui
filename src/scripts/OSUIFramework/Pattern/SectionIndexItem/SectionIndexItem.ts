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
		// Event OnBodyScroll
		private _eventOnBodyScroll: OSUIFramework.Callbacks.Generic;
		// Store the on click event
		private _eventOnClick: Callbacks.Generic;
		//Stores the keyboard callback function
		private _eventOnkeyBoardPress: Callbacks.Generic;
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

		// spies the scroll to know if the target element is visible and sets the item as active
		private _onBodyScroll(): void {
			const headerHeight = document.querySelector('.header').clientHeight;
			const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
			const sectionRect = document.getElementById(this.configs.ScrollToWidgetId).getBoundingClientRect();
			const isInViewport = sectionRect.top <= viewportHeight && sectionRect.bottom >= headerHeight;

			const halfScroll = viewportHeight / 2;

			if (isInViewport) {
				console.log(`${this.configs.ScrollToWidgetId} i am in viewport`);
				if (sectionRect.top <= halfScroll) {
					this.notifyParent(SectionIndex.Enum.ChildNotifyActionType.Active);
				} else if (sectionRect.bottom < halfScroll) {
					this.notifyParent(SectionIndex.Enum.ChildNotifyActionType.Inactive);
				}
			} else {
				this.notifyParent(SectionIndex.Enum.ChildNotifyActionType.Inactive);
			}
		}

		// A11y keyboard navigation
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

		// Method to handle the click event
		private _onSelected(event: Event): void {
			event.preventDefault();
			event.stopPropagation();

			// Update the offsetInfo when clicked since we could have expandable containers that will change this values accoring the scroll content height
			this._setTargetOffsetInfo();

			// Notify parent about this Item Click
			this.notifyParent(SectionIndex.Enum.ChildNotifyActionType.Click);
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

		// Method to set the event listeners
		private _setUpEvents(): void {
			this._selfElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this._selfElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyBoardPress);
			// Add the BodyScroll callback that will be used to update the balloon coodinates
			OSUIFramework.Event.GlobalEventManager.Instance.addHandler(
				OSUIFramework.Event.Type.BodyOnScroll,
				this._eventOnBodyScroll
			);
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
			this._eventOnBodyScroll = this._onBodyScroll.bind(this);
		}

		/**
		 *  Builds the SectionIndexItem.
		 *
		 * @memberof SectionIndexItem
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
		 * @type {OffsetValues}
		 * @memberof SectionIndexItem
		 */
		public get targetElementOffset(): OffsetValues {
			return this._targetElementOffset;
		}
	}
}
