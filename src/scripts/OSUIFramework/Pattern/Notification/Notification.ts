// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Notification {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Notification extends AbstractPattern<NotificationConfig> implements INotification {
		private _isOpen: boolean;
		private _onToggle: Callbacks.OSNotificationToggleEvent;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new NotificationConfig(configs));

			this._isOpen = this._configs.IsOpen;

			console.log(this._configs);
		}

		// Set accessibility atrributes on html elements
		private _setAccessibilityProps(): void {
			console.log('_setAccessibilityProps');
		}

		// Set the html references that will be used to manage the cssClasses and atribute properties
		private _setHtmlElements(): void {
			console.log('_setHtmlElements');
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			console.log('_setInitialCssClasses');
		}

		// Method that triggers the OnToggle event
		private _triggerOnToggleEvent(isOpen: boolean): void {
			setTimeout(() => {
				this._onToggle(this.widgetId, isOpen);
			}, 0);
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
					this._isOpen = propertyValue;
					this._configs.IsOpen = propertyValue;

					if (this._isOpen) {
						Helper.Style.AddClass(this._selfElem, Enum.CssClass.PatternIsOpen);
					} else {
						Helper.Style.RemoveClass(this._selfElem, Enum.CssClass.PatternIsOpen);
					}

					// Only toggle event if the status has chnaged
					this._triggerOnToggleEvent(this._isOpen);

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

		// Set callbacks for the onToggle event
		public registerCallback(callback: Callbacks.OSNotificationToggleEvent): void {
			this._onToggle = callback;
		}
	}
}
