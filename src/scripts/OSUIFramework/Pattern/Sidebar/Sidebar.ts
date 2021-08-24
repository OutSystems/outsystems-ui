// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Sidebar {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Sidebar extends AbstractPattern<SidebarConfig> implements ISidebar {
		// Store if the Sidebar is Open
		private _isOpen: boolean;
		// Store if the Sidebar is Open
		private _onToggle: Callbacks.OSSidebarToggleEvent;
		// Store the Sidebar Content element
		private _sidebarContentElem: HTMLElement;
		// Store the Sidebar Header element
		private _sidebarHeaderElem: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new SidebarConfig(configs));

			this._isOpen = this._configs.IsOpen;
		}

		private _setAccessibilityProps(isOpen: boolean): void {
			Helper.Attribute.Set(this._selfElem, 'role', 'complementary');
			Helper.Attribute.Set(this._selfElem, 'aria-haspopup', 'true');
			Helper.Attribute.Set(this._selfElem, 'tabindex', isOpen ? '0' : '-1');
			Helper.Attribute.Set(this._selfElem, 'aria-hidden', isOpen ? 'false' : 'true');
		}

		// Set the html references that will be used to manage the cssClasses and atribute properties
		private _setHtmlElements(): void {
			this._sidebarHeaderElem = this._selfElem.querySelector('.' + Enum.SidebarCssClass.Header);
			this._sidebarContentElem = this._selfElem.querySelector('.' + Enum.SidebarCssClass.Content);
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// Set IsOpen class
			if (this._isOpen) {
				Helper.Style.AddClass(this._selfElem, Enum.SidebarCssClass.IsOpen);
			}

			// Set default ExtendedClass values
			if (this._configs.ExtendedClass !== '') {
				this.updateExtendedClass(this._configs.ExtendedClass, this._configs.ExtendedClass);
			}
		}

		// Method that triggers the OnToggle event
		private _triggerOnToggleEvent(isOpen: boolean): void {
			if (this._onToggle !== undefined) {
				setTimeout(() => {
					this._onToggle(this.widgetId, isOpen);
				}, 0);
			}
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setInitialCssClasses();

			this._setAccessibilityProps(this._isOpen);

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			if (Enum.Properties[propertyName] && this._configs.hasOwnProperty(propertyName)) {
				// Check which property changed and call respective method to update it
				switch (propertyName) {
					case Enum.Properties.IsOpen:
						this.toggleSidebar(propertyValue);

						this._configs.IsOpen = propertyValue;
						break;
					case Enum.Properties.ExtendedClass:
						this.updateExtendedClass(this._configs.ExtendedClass, propertyValue);

						this._configs.ExtendedClass = propertyValue;
						break;
				}
			} else {
				throw new Error(`changeProperty - Property '${propertyName}' can't be changed.`);
			}
		}

		// Set callbacks for the onToggle event
		public registerCallback(callback: Callbacks.OSSidebarToggleEvent): void {
			this._onToggle = callback;
		}

		public toggleSidebar(isOpen: boolean): void {
			// Toggle event listeners missing
			// Toggle focus if open
			console.log(isOpen);
			isOpen
				? Helper.Style.AddClass(this._selfElem, Enum.SidebarCssClass.IsOpen)
				: Helper.Style.RemoveClass(this._selfElem, Enum.SidebarCssClass.IsOpen);

			this._isOpen = isOpen;
			this._setAccessibilityProps(isOpen);
			this._triggerOnToggleEvent(isOpen);
		}
	}
}
