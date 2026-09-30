// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.TabsContentItem {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class TabsContentItem extends AbstractChild<TabsContentItemConfig, Tabs.ITabs> implements ITabsContentItem {
		// Store the data-tab attribute
		private _dataTab: number;
		private _focusableElements: HTMLElement[];
		// Store if this is the current active item
		private _isActive: boolean;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new TabsContentItemConfig(configs));
		}

		/**
		 * Method to handle the Accessibility attributes
		 *
		 * @protected
		 * @param [isUpdate=true]
		 */
		protected setA11YProperties(isUpdate = true): void {
			if (isUpdate) {
				Helper.A11Y.RoleTabPanel(this.selfElement);
			}

			if (this._isActive) {
				Helper.A11Y.TabIndexTrue(this.selfElement);
				Helper.A11Y.AriaHiddenFalse(this.selfElement);

				// Set the attr that will be used to define the default tabindex element
				Helper.Dom.Attribute.Set(this.selfElement, Constants.FocusableTabIndexDefault, Constants.EmptyString);
			} else {
				Helper.A11Y.TabIndexFalse(this.selfElement);
				Helper.A11Y.AriaHiddenTrue(this.selfElement);

				// Unset the attr that will be used to define the default tabindex element
				Helper.Dom.Attribute.Remove(this.selfElement, Constants.FocusableTabIndexDefault);
			}

			// Will handle the tabindex value of the elements inside pattern, depending if is active
			Helper.A11Y.SetElementsTabIndex(this._isActive, this._focusableElements);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 */
		protected setCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to set the HTML Elements
		 *
		 * @protected
		 */
		protected setHtmlElements(): void {
			this._focusableElements = Helper.Dom.GetFocusableElements(this.selfElement);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 */
		protected unsetCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to unset the HTML Elements
		 *
		 * @protected
		 */
		protected unsetHtmlElements(): void {
			this._focusableElements = undefined;
		}

		/**
		 * Method to build the TabsContentItem
		 */
		public build(): void {
			super.build();

			this.setHtmlElements();

			this.setParentInfo(
				Constants.Dot + Tabs.Enum.CssClasses.TabsWrapper,
				OutSystems.OSUI.Patterns.TabsAPI.GetTabsById
			);

			// Notify parent about a new instance of this child has been created!
			this.notifyParent(Tabs.Enum.ChildNotifyActionType.AddContentItem);

			this.setA11YProperties(false);

			this.finishBuild();
		}

		/**
		 * Method to remove event listener and destroy TabsContentItem instance
		 */
		public dispose(): void {
			this.unsetHtmlElements();
			// Notify parent about this instance will be destroyed
			this.notifyParent(Tabs.Enum.ChildNotifyActionType.RemovedContentItem);

			super.dispose();
		}

		/**
		 * Method to get the current data-tab attribute, called by the Tabs
		 */
		public getDataTab(): number {
			return this._dataTab;
		}

		/**
		 * Method to get the element offsetLeft value, called by the Tabs
		 */
		public getOffsetLeft(): number {
			return this.selfElement.offsetLeft;
		}

		/**
		 * Method to set the aria-labbeledby attribute, called by the tabs
		 *
		 * @param headerItemId
		 */
		public setAriaLabelledByAttribute(headerItemId: string): void {
			Helper.A11Y.AriaLabelledBy(this.selfElement, headerItemId);
		}

		/**
		 * Method to set the data-tab attribute, called by the tabs
		 *
		 * @param dataTab
		 */
		public setDataTab(dataTab: number): void {
			Helper.Dom.Attribute.Set(this.selfElement, Tabs.Enum.Attributes.DataTab, dataTab.toString());
			this._dataTab = dataTab;
		}

		/**
		 * Method to set the element as active, called by the tabs
		 */
		public setIsActive(): void {
			if (this.selfElement) {
				Helper.Dom.Styles.AddClass(this.selfElement, Patterns.Tabs.Enum.CssClasses.ActiveTab);
				this._isActive = true;
				this.setA11YProperties();
			}
		}

		/**
		 * Method to set the intersection observer, called by the tabs
		 *
		 * @param observer
		 */
		public setOnDragObserver(observer: IntersectionObserver): void {
			observer.observe(this.selfElement);
		}

		/**
		 * Method to stop observing this element in the intersection observer, called by the tabs
		 *
		 * @param observer
		 */
		public unobserveDragObserver(observer: IntersectionObserver): void {
			// disconnect observer when destroyed from DOM
			observer.unobserve(this.selfElement);
		}

		/**
		 * Method to set the element as active, called by the tabs
		 */
		public unsetIsActive(): void {
			if (this.selfElement) {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Patterns.Tabs.Enum.CssClasses.ActiveTab);
				this._isActive = false;
				this.setA11YProperties();
			}
		}

		/**
		 * Readable property to get the active state of the element
		 *
		 * @readonly
		 */
		public get IsActive(): boolean {
			return this._isActive;
		}
	}
}
