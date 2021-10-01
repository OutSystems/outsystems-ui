// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Notification {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Notification extends AbstractPattern<NotificationConfig> implements INotification {
		private _onToggle: Callbacks.OSNotificationToggleEvent;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new NotificationConfig(configs));

			console.log(this._configs);
		}

		// Set accessibility atrributes on html elements
		private _setAccessibilityProps(): void {
			Helper.Attribute.Set(
				this._selfElem,
				Constants.AccessibilityAttribute.Role.AttrName,
				Constants.AccessibilityAttribute.Role.Alert
			);

			// Update accessibility properties
			this._updateAccessibilityProps();

			console.log('_setAccessibilityProps');
		}

		// Set the html references that will be used to manage the cssClasses and atribute properties
		private _setHtmlElements(): void {
			console.log('_setHtmlElements');
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			this._toggleNotification(this._configs.IsOpen);

			// Set width value for Notification
			if (this._configs.Width !== '') {
				Helper.Style.SetStyleAttribute(this._selfElem, Enum.CssProperty.Width, this._configs.Width);
			}

			// Set position initial class
			if (this._configs.Position !== '') {
				Helper.Style.AddClass(this._selfElem, Enum.CssClass.PatternPosition + this._configs.Position);
			}

			// Set HasOverlay class
			if (this._configs.HasOverlay) {
				Helper.Style.AddClass(this._selfElem, Enum.CssClass.PatternOverlay);
			}
			console.log('_setInitialCssClasses');
		}

		private _setOverlay(overlay: boolean): void {
			this._configs.HasOverlay = overlay;
			// Reset direction class
			if (this._configs.HasOverlay) {
				Helper.Style.AddClass(this._selfElem, Enum.CssClass.PatternOverlay);
			} else {
				Helper.Style.RemoveClass(this._selfElem, Enum.CssClass.PatternOverlay);
			}
		}

		private _setPosition(position: string): void {
			// Reset direction class
			if (this._configs.Position !== '') {
				Helper.Style.RemoveClass(this._selfElem, Enum.CssClass.PatternPosition + this._configs.Position);
			}

			Helper.Style.AddClass(this._selfElem, Enum.CssClass.PatternPosition + position);
			this._configs.Position = position;
		}

		// Set the Sidebar width
		private _setWidth(width: string): void {
			this._configs.Width = width;
			if (width !== '') {
				// Update css variable
				Helper.Style.SetStyleAttribute(this._selfElem, Enum.CssProperty.Width, width);
				this._configs.Width = width;
			}
		}

		// Toggle visibility of Notification
		private _toggleNotification(isOpen: boolean): void {
			this._configs.IsOpen = isOpen;

			if (this._configs.IsOpen) {
				this.show();
			} else {
				this.hide();
			}
		}
		// Method that triggers the OnToggle event
		private _triggerOnToggleEvent(isOpen: boolean): void {
			setTimeout(() => {
				this._onToggle(this.widgetId, isOpen);
			}, 0);
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _updateAccessibilityProps(): void {
			Helper.Attribute.Set(
				this._selfElem,
				Constants.AccessibilityAttribute.Aria.Hidden,
				(!this._configs.IsOpen).toString()
			);

			Helper.Attribute.Set(
				this._selfElem,
				Constants.AccessibilityAttribute.TabIndex,
				this._configs.IsOpen
					? Constants.AccessibilityAttribute.States.TabIndexShow
					: Constants.AccessibilityAttribute.States.TabIndexHidden
			);
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setInitialCssClasses();

			this._setAccessibilityProps();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			// Check which property changed and call respective method to update it
			switch (propertyName) {
				case Enum.Properties.IsOpen:
					this._toggleNotification(propertyValue);

					break;
				case Enum.Properties.HasOverlay:
					this._setOverlay(propertyValue);
					break;
				case Enum.Properties.Position:
					this._setPosition(propertyValue);
					break;
				case Enum.Properties.Width:
					this._setWidth(propertyValue);
					break;
				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}
		}

		// Method to remove event listener and destroy notification instance
		public dispose(): void {
			super.dispose();

			console.log('Notification destroyed!');
		}

		// Hide Notification
		public hide(): void {
			Helper.Style.RemoveClass(this._selfElem, Enum.CssClass.PatternIsOpen);

			// Trigger Notification event with new status
			this._triggerOnToggleEvent(this._configs.IsOpen);

			// Update accessibility properties
			this._updateAccessibilityProps();

			console.log('Notification hidded!');
		}

		// Set callbacks for the onToggle event
		public registerCallback(callback: Callbacks.OSNotificationToggleEvent): void {
			this._onToggle = callback;
		}

		// Show Notification
		public show(): void {
			Helper.Style.AddClass(this._selfElem, Enum.CssClass.PatternIsOpen);

			// Trigger Notification event with new status
			this._triggerOnToggleEvent(this._configs.IsOpen);

			// Update accessibility properties
			this._updateAccessibilityProps();

			console.log('Notification Visible!');
		}
	}
}
