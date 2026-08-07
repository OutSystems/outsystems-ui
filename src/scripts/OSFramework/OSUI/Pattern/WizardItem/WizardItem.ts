// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.WizardItem {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class WizardItem extends AbstractChild<WizardItemConfig, Wizard.IWizard> implements IWizardItem {
		private _dataBlockParent: HTMLElement;
		// Store the click event
		private _eventOnClick: GlobalCallbacks.Generic;
		// Callback function to trigger the click event on the platform
		private _platformEventOnClick: GlobalCallbacks.Generic;
		// Store the wizard content label html reference
		private _wizardContentLabelElement: HTMLElement;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new WizardItemConfig(configs));
		}

		// Method to add the events to the element
		private _addEvents(): void {
			// Manage the Item click event based on the wizard StepBehavior and Item Status
			if (
				this.parentObject.configs.StepBehavior === Wizard.Enum.StepBehavior.Interactive &&
				this.configs.Status === Enum.Status.Past
			) {
				this._dataBlockParent.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			} else {
				this._dataBlockParent.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			}
		}

		// Method to handle the click event
		private _clickHandler(): void {
			this.triggerPlatformEventCallback(this._platformEventOnClick);
		}

		// Method to set CSS classed to the element
		private _setCssClasses(): void {
			// Manage status css class
			this._setStatusCssClass();

			// Manage reverse label position css class
			if (this.configs.ReverseLabelPosition) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.HasReverseLabelPosition);
			} else {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.HasReverseLabelPosition);
			}
		}

		// Method to set the status css class
		private _setStatusCssClass(): void {
			if (this.configs.Status === Enum.Status.Past) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsPast);
			} else {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.IsPast);
			}

			if (this.configs.Status === Enum.Status.Active) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsActive);
			} else {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.IsActive);
			}

			if (this.configs.Status === Enum.Status.Next) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsNext);
			} else {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.IsNext);
			}
		}

		// Method to set the parent Info, if a wizard wrapper is being used
		private _setWizardParent(): void {
			// Get parent info
			this.setParentInfo(
				Constants.Dot + Wizard.Enum.CssClass.Pattern,
				OutSystems.OSUI.Patterns.WizardAPI.GetWizardById,
				true
			);

			// Notify parent about a new instance of this child has been created!
			if (this.parentObject) {
				this.notifyParent(Wizard.Enum.ChildNotifyActionType.Add);
			}
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.WizardItem.WizardItem
		 */
		protected setA11YProperties(): void {
			// Clean up aria-* attributes
			Helper.Dom.Attribute.Remove(this._dataBlockParent, Constants.A11YAttributes.Aria.Current.prop);
			Helper.Dom.Attribute.Remove(this._dataBlockParent, Constants.A11YAttributes.Aria.Selected);

			// Set aria-label based on the content label
			Helper.A11Y.AriaLabel(this._dataBlockParent, this._wizardContentLabelElement.textContent);

			// Manage role, tabindex, aria-selected and aria-current bsaed on type and status
			if (this.parentObject.configs.StepBehavior === Wizard.Enum.StepBehavior.Interactive) {
				// Set role to tab
				Helper.A11Y.RoleTab(this._dataBlockParent);

				// Set TabIndex to true
				Helper.A11Y.TabIndexTrue(this._dataBlockParent);

				if (this.configs.Status === Enum.Status.Active) {
					Helper.A11Y.AriaSelectedTrue(this._dataBlockParent);
				} else {
					Helper.A11Y.AriaSelectedFalse(this._dataBlockParent);
				}
			} else {
				// Set role to listitem
				Helper.A11Y.RoleListitem(this._dataBlockParent);

				// Remove tabindex attribute
				Helper.Dom.Attribute.Remove(this._dataBlockParent, Constants.A11YAttributes.TabIndex);

				if (this.configs.Status === Enum.Status.Active) {
					Helper.A11Y.AriaCurrent(this._dataBlockParent, GlobalEnum.A11YAriaCurrentValues.Step);
				}
			}

			if (this.configs.Status === Enum.Status.Next) {
				Helper.A11Y.AriaDisabledTrue(this._dataBlockParent);
			} else {
				Helper.Dom.Attribute.Remove(this._dataBlockParent, Constants.A11YAttributes.Aria.Disabled);
			}
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.WizardItem.WizardItem
		 */
		protected setCallbacks(): void {
			this._eventOnClick = this._clickHandler.bind(this);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.WizardItem.WizardItem
		 */
		protected setHtmlElements(): void {
			this._dataBlockParent = this.selfElement.parentElement;
			this._wizardContentLabelElement = Helper.Dom.ClassSelector(
				this.selfElement,
				Enum.CssClass.WizardContentLabel
			);

			this._setCssClasses();
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.WizardItem.WizardItem
		 */
		protected unsetCallbacks(): void {
			this._eventOnClick = undefined;
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.WizardItem.WizardItem
		 */
		protected unsetHtmlElements(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to be notified by the parent that a new property value has been set
		 *
		 * @param {Enum.ParentNotifyActionType} notificationType Notification type
		 * @memberof OSFramework.Patterns.WizardItem.WizardItem
		 */
		public beNotifiedByParent(notificationType: Enum.ParentNotifyActionType): void {
			if (notificationType === Enum.ParentNotifyActionType.HasNewProps) {
				this._setCssClasses();
				this.setA11YProperties();
				this._addEvents();
			}
		}

		/**
		 * Method to build the WizardItem
		 *
		 * @memberof OSFramework.Patterns.WizardItem.WizardItem
		 */
		public build(): void {
			super.build();

			this._setWizardParent();

			this.setHtmlElements();

			this.setA11YProperties();

			this.setCallbacks();

			this._addEvents();

			this.finishBuild();
		}

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof OSFramework.Patterns.WizardItem.WizardItem
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (propertyName !== Enum.Properties.ExtendedClass) {
				this._setCssClasses();
				this.setA11YProperties();
				this._addEvents();
			}
		}

		/**
		 * Method to destroy WizardItem instance
		 *
		 * @memberof OSFramework.Patterns.WizardItem.WizardItem
		 */
		public dispose(): void {
			if (this.parentObject) {
				// Notify parent about this instance will be destroyed
				this.notifyParent(Wizard.Enum.ChildNotifyActionType.Removed);
			}

			super.dispose();
		}

		public registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case Enum.Events.OnClick:
					if (this._platformEventOnClick === undefined) {
						this._platformEventOnClick = callback;
					}
					break;
				default:
					super.registerCallback(eventName, callback);
			}
		}
	}
}
